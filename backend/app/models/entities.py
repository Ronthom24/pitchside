from datetime import datetime, date
from app.timeutil import utcnow
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


def now() -> datetime:
    return utcnow()


class Country(Base):
    __tablename__ = "countries"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g. "england"
    name: Mapped[str] = mapped_column(String)
    flag_emoji: Mapped[str | None] = mapped_column(String, nullable=True)
    confederation: Mapped[str | None] = mapped_column(String, nullable=True)  # UEFA, CONMEBOL, AFC...


class Stadium(Base):
    __tablename__ = "stadiums"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    city: Mapped[str | None] = mapped_column(String, nullable=True)
    country_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id"), nullable=True)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    opened_year: Mapped[int | None] = mapped_column(Integer, nullable=True)


class Competition(Base):
    __tablename__ = "competitions"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "premier-league"
    name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)  # domestic_league, continental_club, international
    country_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id"), nullable=True)
    tier: Mapped[int | None] = mapped_column(Integer, nullable=True)
    format_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    history_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    founded_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    external_ids: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class Club(Base):
    __tablename__ = "clubs"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "arsenal"
    name: Mapped[str] = mapped_column(String)
    short_name: Mapped[str | None] = mapped_column(String, nullable=True)
    nickname: Mapped[str | None] = mapped_column(String, nullable=True)
    country_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id"), nullable=True)
    city: Mapped[str | None] = mapped_column(String, nullable=True)
    founded_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stadium_id: Mapped[str | None] = mapped_column(ForeignKey("stadiums.id"), nullable=True)
    primary_color: Mapped[str | None] = mapped_column(String, nullable=True)
    secondary_color: Mapped[str | None] = mapped_column(String, nullable=True)
    crest_url: Mapped[str | None] = mapped_column(String, nullable=True)
    current_competition_id: Mapped[str | None] = mapped_column(ForeignKey("competitions.id"), nullable=True)
    current_manager_id: Mapped[str | None] = mapped_column(ForeignKey("managers.id"), nullable=True)
    playing_style_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    typical_formation: Mapped[str | None] = mapped_column(String, nullable=True)
    history_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    culture_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    identity_tags: Mapped[list | None] = mapped_column(JSON, nullable=True)  # e.g. ["historic","attacking","big-fanbase"]
    facts_as_of: Mapped[str | None] = mapped_column(String, nullable=True)  # when volatile facts (manager etc.) were last confirmed
    external_ids: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class Manager(Base):
    __tablename__ = "managers"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    nationality_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id"), nullable=True)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    tactical_style: Mapped[str | None] = mapped_column(Text, nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    external_ids: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class Player(Base):
    __tablename__ = "players"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "lionel-messi"
    name: Mapped[str] = mapped_column(String)
    full_name: Mapped[str | None] = mapped_column(String, nullable=True)
    nationality_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id"), nullable=True)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    death_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    facts_as_of: Mapped[str | None] = mapped_column(String, nullable=True)
    position: Mapped[str | None] = mapped_column(String, nullable=True)  # position code e.g. "ST"
    current_club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True)
    shirt_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    playing_style: Mapped[str | None] = mapped_column(Text, nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    is_retired: Mapped[bool] = mapped_column(Boolean, default=False)
    external_ids: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class PlayerClubHistory(Base):
    __tablename__ = "player_club_history"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    player_id: Mapped[str] = mapped_column(ForeignKey("players.id"))
    club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True)
    club_name: Mapped[str] = mapped_column(String)
    start_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    end_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    appearances: Mapped[int | None] = mapped_column(Integer, nullable=True)
    goals: Mapped[int | None] = mapped_column(Integer, nullable=True)
    note: Mapped[str | None] = mapped_column(String, nullable=True)  # e.g. "on loan"


class Honour(Base):
    __tablename__ = "honours"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True)
    competition_name: Mapped[str] = mapped_column(String)
    count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    years: Mapped[list | None] = mapped_column(JSON, nullable=True)
    scope: Mapped[str] = mapped_column(String, default="domestic")  # domestic, continental, international
    as_of: Mapped[str | None] = mapped_column(String, nullable=True)  # season the count was confirmed through


class Rivalry(Base):
    __tablename__ = "rivalries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    club_a_id: Mapped[str] = mapped_column(ForeignKey("clubs.id"))
    club_b_id: Mapped[str] = mapped_column(ForeignKey("clubs.id"))
    name: Mapped[str | None] = mapped_column(String, nullable=True)  # e.g. "El Clasico"
    summary: Mapped[str] = mapped_column(Text)


class ClubTimelineEvent(Base):
    __tablename__ = "club_timeline_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    club_id: Mapped[str] = mapped_column(ForeignKey("clubs.id"))
    year: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "false-nine"
    term: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)  # tactics, rules, stats, culture
    short_definition: Mapped[str] = mapped_column(Text)
    long_explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    example: Mapped[str | None] = mapped_column(Text, nullable=True)
    related_terms: Mapped[list | None] = mapped_column(JSON, nullable=True)


class HistoryEvent(Base):
    __tablename__ = "history_events"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    era: Mapped[str] = mapped_column(String)  # origins, early-game, post-war, modern ...
    category: Mapped[str] = mapped_column(String)  # rules, world-cup, club, tactics, people, tournament
    title: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text)
    related_club_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)
    related_competition_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)
    source_note: Mapped[str | None] = mapped_column(String, nullable=True)


class LessonTopic(Base):
    __tablename__ = "lesson_topics"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "offside"
    level: Mapped[int] = mapped_column(Integer)  # 1 = basics, 2 = rules, 3 = tactics...
    order: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text)
    body_markdown: Mapped[str] = mapped_column(Text)
    interactive_component: Mapped[str | None] = mapped_column(String, nullable=True)  # "OffsideSimulator"
    quiz: Mapped[list | None] = mapped_column(JSON, nullable=True)
    related_glossary_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)
