from datetime import date
from pydantic import BaseModel, ConfigDict


class CountryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    flag_emoji: str | None = None
    confederation: str | None = None


class StadiumOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    city: str | None = None
    country_id: str | None = None
    capacity: int | None = None
    opened_year: int | None = None


class CompetitionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    category: str
    country_id: str | None = None
    tier: int | None = None
    format_summary: str | None = None
    history_summary: str | None = None
    founded_year: int | None = None
    logo_url: str | None = None
    live_data_available: bool = False


class ManagerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    nationality_id: str | None = None
    tactical_style: str | None = None
    bio: str | None = None
    photo_url: str | None = None


class HonourOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    competition_name: str
    count: int | None = None
    years: list | None = None
    scope: str
    as_of: str | None = None


class RivalryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    club_a_id: str
    club_b_id: str
    name: str | None = None
    summary: str


class ClubTimelineEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    year: int
    title: str
    description: str | None = None


class ClubListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    short_name: str | None = None
    nickname: str | None = None
    country_id: str | None = None
    city: str | None = None
    founded_year: int | None = None
    crest_url: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    current_competition_id: str | None = None
    identity_tags: list | None = None


class ClubDetailOut(ClubListOut):
    stadium_id: str | None = None
    stadium: StadiumOut | None = None
    manager: ManagerOut | None = None
    country_name: str | None = None
    competition_name: str | None = None
    facts_as_of: str | None = None
    current_manager_id: str | None = None
    playing_style_summary: str | None = None
    typical_formation: str | None = None
    history_summary: str | None = None
    culture_summary: str | None = None
    honours: list[HonourOut] = []
    rivalries: list[RivalryOut] = []
    timeline: list[ClubTimelineEventOut] = []


class PlayerListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    nationality_id: str | None = None
    position: str | None = None
    current_club_id: str | None = None
    photo_url: str | None = None
    is_retired: bool
    birth_date: date | None = None


class CareerStintOut(BaseModel):
    club_id: str | None = None
    club_name: str
    start_year: int | None = None
    end_year: int | None = None


class PlayerDetailOut(PlayerListOut):
    full_name: str | None = None
    death_date: date | None = None
    facts_as_of: str | None = None
    shirt_number: int | None = None
    playing_style: str | None = None
    bio: str | None = None
    nationality_name: str | None = None
    current_club: ClubListOut | None = None
    career: list[CareerStintOut] = []


class HistoryEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    year: int
    era: str
    category: str
    title: str
    summary: str
    related_club_ids: list | None = None
    related_competition_ids: list | None = None


class GlossaryTermOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    term: str
    category: str
    short_definition: str
    long_explanation: str | None = None
    example: str | None = None
    related_terms: list | None = None


class LessonTopicOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    level: int
    order: int
    title: str
    summary: str
    body_markdown: str
    interactive_component: str | None = None
    quiz: list | None = None
    related_glossary_ids: list | None = None
