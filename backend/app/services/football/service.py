"""FootballDataService: the only layer the routers talk to for live/current data.

Provider -> normalise -> DB cache (with source + last_updated) -> API.
Swap providers by registering a different adapter; nothing above this file changes.
"""
import asyncio
import re
import unicodedata
from datetime import datetime, timedelta

from app.timeutil import utcnow
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.services.football.base import ProviderAdapter, ProviderUnavailable
from app.services.football.providers.football_data_org import FootballDataOrgProvider

MATCHES_TTL = timedelta(minutes=30)
STANDINGS_TTL = timedelta(hours=2)

PROVIDERS: list[ProviderAdapter] = [FootballDataOrgProvider()]
_locks: dict[str, asyncio.Lock] = {}

_NOISE = re.compile(r"\b(fc|cf|afc|ac|as|ssc|sc|fk|rc|ud|cd|sv|vfl|vfb|tsg|1899|1\.|calcio|de|club|football|balompie)\b")


def _norm(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = _NOISE.sub(" ", s)
    return re.sub(r"\s+", " ", s).strip()


# Alias -> club id for names providers use that don't normalise to ours.
ALIASES = {
    "manchester united": "manchester-united", "manchester city": "manchester-city",
    "club atletico de madrid": "atletico-madrid", "atletico madrid": "atletico-madrid",
    "fc bayern munchen": "bayern-munich", "bayern munchen": "bayern-munich", "bayern munich": "bayern-munich",
    "borussia dortmund": "borussia-dortmund", "juventus": "juventus",
    "internazionale milano": "inter-milan", "inter": "inter-milan", "inter milan": "inter-milan",
    "milan": "ac-milan", "paris saint germain": "paris-saint-germain", "paris saint-germain": "paris-saint-germain",
    "real madrid": "real-madrid", "barcelona": "barcelona", "arsenal": "arsenal", "chelsea": "chelsea",
    "liverpool": "liverpool", "ajax": "ajax", "afc ajax": "ajax",
}


async def _club_lookup(db: AsyncSession) -> dict[str, str]:
    lookup = dict(ALIASES)
    for c in (await db.execute(select(models.Club))).scalars().all():
        for n in {c.name, c.short_name or ""}:
            if n:
                lookup.setdefault(_norm(n), c.id)
    return {_norm(k): v for k, v in lookup.items()}


def _match_club(name: str, lookup: dict[str, str]) -> str | None:
    return lookup.get(_norm(name))


def _provider_for(comp: models.Competition) -> tuple[ProviderAdapter, str] | None:
    ext = (comp.external_ids or {}).get("football-data.org")
    for p in PROVIDERS:
        if p.supports(ext):
            return p, ext
    return None


def live_data_available(comp: models.Competition) -> bool:
    """True if this competition has a mapped external id (regardless of key being set)."""
    return bool((comp.external_ids or {}).get("football-data.org"))


async def sync_competition(db: AsyncSession, comp: models.Competition, kind: str) -> str | None:
    """Refresh `matches` or `standings`. Returns an error message or None. Never raises on provider failure."""
    resolved = _provider_for(comp)
    if not resolved:
        return "Live data provider not configured for this competition"
    provider, ext = resolved
    lock = _locks.setdefault(f"{comp.id}:{kind}", asyncio.Lock())
    async with lock:
        try:
            lookup = await _club_lookup(db)
            now = utcnow()
            if kind == "matches":
                rows = await provider.fetch_matches(ext)
                for m in rows:
                    mid = f"{provider.name}:{m.external_id}"
                    obj = await db.get(models.Match, mid) or models.Match(id=mid, competition_id=comp.id)
                    obj.season, obj.matchday, obj.kickoff_utc, obj.status = m.season, m.matchday, m.kickoff_utc, m.status
                    obj.home_name, obj.away_name = m.home_name, m.away_name
                    obj.home_club_id, obj.away_club_id = _match_club(m.home_name, lookup), _match_club(m.away_name, lookup)
                    obj.home_score, obj.away_score = m.home_score, m.away_score
                    obj.source, obj.last_updated = provider.name, now
                    db.add(obj)
            else:
                rows = await provider.fetch_standings(ext)
                if rows:
                    await db.execute(delete(models.StandingRow).where(
                        models.StandingRow.competition_id == comp.id, models.StandingRow.season == rows[0].season))
                for r in rows:
                    db.add(models.StandingRow(
                        competition_id=comp.id, season=r.season, position=r.position,
                        club_id=_match_club(r.team_name, lookup), team_name=r.team_name, played=r.played,
                        won=r.won, drawn=r.drawn, lost=r.lost, goals_for=r.goals_for,
                        goals_against=r.goals_against, points=r.points, source=provider.name, last_updated=now))
            db.add(models.SyncLog(competition_id=comp.id, kind=kind, ok=True))
            await db.commit()
            return None
        except ProviderUnavailable as e:
            # The provider is called before any rows are written, so there is nothing to roll back.
            # (A rollback would expire `comp`, and touching it afterwards would crash the request.)
            db.add(models.SyncLog(competition_id=comp.id, kind=kind, ok=False, message=str(e)))
            await db.commit()
            return str(e)


async def last_success(db: AsyncSession, comp_id: str, kind: str) -> datetime | None:
    row = (await db.execute(
        select(models.SyncLog).where(models.SyncLog.competition_id == comp_id, models.SyncLog.kind == kind,
                                     models.SyncLog.ok.is_(True)).order_by(models.SyncLog.at.desc()).limit(1)
    )).scalar_one_or_none()
    return row.at if row else None


async def last_attempt(db: AsyncSession, comp_id: str, kind: str) -> datetime | None:
    row = (await db.execute(
        select(models.SyncLog).where(models.SyncLog.competition_id == comp_id, models.SyncLog.kind == kind)
        .order_by(models.SyncLog.at.desc()).limit(1)
    )).scalar_one_or_none()
    return row.at if row else None


async def ensure_fresh(db: AsyncSession, comp: models.Competition, kind: str) -> str | None:
    """Refresh if the cache is older than its TTL. Failed attempts also back off for the TTL window
    (capped at 5 minutes) so a missing key or rate limit never causes a request storm."""
    if not _provider_for(comp):
        if live_data_available(comp):
            return "Live data is not configured on this server (FOOTBALL_API_KEY is not set)."
        return None
    ttl = MATCHES_TTL if kind == "matches" else STANDINGS_TTL
    now = utcnow()
    ok, attempt = await last_success(db, comp.id, kind), await last_attempt(db, comp.id, kind)
    if ok and now - ok < ttl:
        return None
    if attempt and now - attempt < min(ttl, timedelta(minutes=5)):
        return None
    return await sync_competition(db, comp, kind)
