import os
from datetime import datetime

import httpx

from app.services.football.base import MatchDTO, StandingDTO, ProviderUnavailable

BASE_URL = os.getenv("FOOTBALL_API_BASE_URL", "https://api.football-data.org/v4")


def _dt(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)


class FootballDataOrgProvider:
    """football-data.org v4 (free tier: limited competitions, 10 requests/minute)."""

    name = "football-data.org"

    def __init__(self) -> None:
        self.api_key = os.getenv("FOOTBALL_API_KEY", "").strip()

    def supports(self, competition_external_id: str | None) -> bool:
        return bool(self.api_key and competition_external_id)

    async def _get(self, path: str) -> dict:
        if not self.api_key:
            raise ProviderUnavailable("FOOTBALL_API_KEY is not set")
        async with httpx.AsyncClient(timeout=20) as client:
            res = await client.get(f"{BASE_URL}{path}", headers={"X-Auth-Token": self.api_key})
        if res.status_code == 429:
            raise ProviderUnavailable("Rate limited by football-data.org; try again shortly")
        if res.status_code in (401, 403):
            raise ProviderUnavailable("football-data.org rejected the key or this competition is not in the plan")
        if res.status_code != 200:
            raise ProviderUnavailable(f"football-data.org returned {res.status_code}")
        return res.json()

    async def fetch_matches(self, competition_external_id: str) -> list[MatchDTO]:
        data = await self._get(f"/competitions/{competition_external_id}/matches")
        out: list[MatchDTO] = []
        for m in data.get("matches", []):
            home, away = m.get("homeTeam", {}), m.get("awayTeam", {})
            if not home.get("name") or not away.get("name"):
                continue  # knockout slots with undetermined teams
            ft = (m.get("score") or {}).get("fullTime") or {}
            season = (m.get("season") or {}).get("startDate", "")[:4] or None
            out.append(MatchDTO(
                external_id=str(m["id"]), season=season, matchday=m.get("matchday"),
                kickoff_utc=_dt(m.get("utcDate")), status=m.get("status", "SCHEDULED"),
                home_name=home["name"], away_name=away["name"],
                home_score=ft.get("home"), away_score=ft.get("away"),
            ))
        return out

    async def fetch_standings(self, competition_external_id: str) -> list[StandingDTO]:
        data = await self._get(f"/competitions/{competition_external_id}/standings")
        season = (data.get("season") or {}).get("startDate", "")[:4]
        out: list[StandingDTO] = []
        for table in data.get("standings", []):
            if table.get("type") != "TOTAL":
                continue
            for row in table.get("table", []):
                out.append(StandingDTO(
                    season=season, position=row["position"], team_name=row["team"]["name"],
                    played=row["playedGames"], won=row["won"], drawn=row["draw"], lost=row["lost"],
                    goals_for=row["goalsFor"], goals_against=row["goalsAgainst"], points=row["points"],
                ))
            break  # first TOTAL table only; group-stage tournaments handled later
        return out
