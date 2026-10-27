from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.timeutil import utcnow
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app import models
from app.services.football import service

router = APIRouter(prefix="/api/live", tags=["live"])


def _iso(dt: datetime | None):
    return dt.isoformat() + "Z" if dt else None


def _match_out(m: models.Match):
    return {
        "id": m.id, "competition_id": m.competition_id, "matchday": m.matchday, "kickoff_utc": _iso(m.kickoff_utc),
        "status": m.status, "home_club_id": m.home_club_id, "away_club_id": m.away_club_id,
        "home_name": m.home_name, "away_name": m.away_name, "home_score": m.home_score, "away_score": m.away_score,
    }


async def _comp(db: AsyncSession, comp_id: str) -> models.Competition:
    comp = await db.get(models.Competition, comp_id)
    if not comp:
        raise HTTPException(404, "Competition not found")
    return comp


@router.get("/competitions/{comp_id}/standings")
async def standings(comp_id: str, db: AsyncSession = Depends(get_db)):
    comp = await _comp(db, comp_id)
    error = await service.ensure_fresh(db, comp, "standings")
    rows = (await db.execute(
        select(models.StandingRow).where(models.StandingRow.competition_id == comp_id)
        .order_by(models.StandingRow.season.desc(), models.StandingRow.position)
    )).scalars().all()
    season = rows[0].season if rows else None
    rows = [r for r in rows if r.season == season]
    return {
        "live_available": service.live_data_available(comp),
        "season": season,
        "source": rows[0].source if rows else None,
        "updated_at": _iso(max((r.last_updated for r in rows), default=None)),
        "error": error,
        "rows": [{
            "position": r.position, "club_id": r.club_id, "team_name": r.team_name, "played": r.played,
            "won": r.won, "drawn": r.drawn, "lost": r.lost, "goals_for": r.goals_for,
            "goals_against": r.goals_against, "points": r.points,
        } for r in rows],
    }


@router.get("/competitions/{comp_id}/matches")
async def competition_matches(comp_id: str, db: AsyncSession = Depends(get_db)):
    comp = await _comp(db, comp_id)
    error = await service.ensure_fresh(db, comp, "matches")
    now = utcnow()
    rows = (await db.execute(select(models.Match).where(models.Match.competition_id == comp_id))).scalars().all()
    upcoming = sorted([m for m in rows if m.status not in ("FINISHED", "AWARDED") and (m.kickoff_utc or now) >= now.replace(hour=0, minute=0)],
                      key=lambda m: m.kickoff_utc or now)[:10]
    recent = sorted([m for m in rows if m.status == "FINISHED"], key=lambda m: m.kickoff_utc or now, reverse=True)[:10]
    return {
        "live_available": service.live_data_available(comp), "error": error,
        "source": rows[0].source if rows else None,
        "updated_at": _iso(max((m.last_updated for m in rows), default=None)),
        "upcoming": [_match_out(m) for m in upcoming], "recent": [_match_out(m) for m in recent],
    }


@router.get("/clubs/{club_id}/matches")
async def club_matches(club_id: str, db: AsyncSession = Depends(get_db)):
    club = await db.get(models.Club, club_id)
    if not club:
        raise HTTPException(404, "Club not found")
    comp = await db.get(models.Competition, club.current_competition_id) if club.current_competition_id else None
    error = await service.ensure_fresh(db, comp, "matches") if comp else None
    now = utcnow()
    rows = (await db.execute(select(models.Match).where(
        or_(models.Match.home_club_id == club_id, models.Match.away_club_id == club_id)))).scalars().all()
    upcoming = sorted([m for m in rows if m.status not in ("FINISHED", "AWARDED") and (m.kickoff_utc or now) >= now.replace(hour=0, minute=0)],
                      key=lambda m: m.kickoff_utc or now)[:5]
    recent = sorted([m for m in rows if m.status == "FINISHED"], key=lambda m: m.kickoff_utc or now, reverse=True)[:5]
    position = None
    if comp:
        srows = (await db.execute(select(models.StandingRow).where(
            models.StandingRow.competition_id == comp.id, models.StandingRow.club_id == club_id)
            .order_by(models.StandingRow.season.desc()).limit(1))).scalar_one_or_none()
        if srows:
            position = {"position": srows.position, "points": srows.points, "played": srows.played,
                        "season": srows.season, "updated_at": _iso(srows.last_updated), "source": srows.source}
    return {
        "live_available": bool(comp and service.live_data_available(comp)), "error": error,
        "updated_at": _iso(max((m.last_updated for m in rows), default=None)),
        "source": rows[0].source if rows else None, "league_position": position,
        "upcoming": [_match_out(m) for m in upcoming], "recent": [_match_out(m) for m in recent],
    }
