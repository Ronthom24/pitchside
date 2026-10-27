from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass
class MatchDTO:
    external_id: str
    season: str | None
    matchday: int | None
    kickoff_utc: datetime | None
    status: str
    home_name: str
    away_name: str
    home_score: int | None
    away_score: int | None


@dataclass
class StandingDTO:
    season: str
    position: int
    team_name: str
    played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    points: int


class ProviderUnavailable(Exception):
    """Raised when a provider is not configured or the request failed."""


class ProviderAdapter(Protocol):
    name: str

    def supports(self, competition_external_id: str | None) -> bool: ...
    async def fetch_matches(self, competition_external_id: str) -> list[MatchDTO]: ...
    async def fetch_standings(self, competition_external_id: str) -> list[StandingDTO]: ...
