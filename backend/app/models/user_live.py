from datetime import datetime
from app.timeutil import utcnow
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, JSON, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


def now() -> datetime:
    return utcnow()


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(String, nullable=True)
    password_hash: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)


class UserFollowedClub(Base):
    """User -> Club relationship. is_primary marks the club shown as 'My Club'."""
    __tablename__ = "user_followed_clubs"
    __table_args__ = (UniqueConstraint("user_id", "club_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    club_id: Mapped[str] = mapped_column(ForeignKey("clubs.id"))
    is_primary: Mapped[bool] = mapped_column(default=False)
    followed_at: Mapped[datetime] = mapped_column(DateTime, default=now)


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lesson_topics.id"))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    best_quiz_score: Mapped[float | None] = mapped_column(Float, nullable=True)  # 0..1


class Bookmark(Base):
    __tablename__ = "bookmarks"
    __table_args__ = (UniqueConstraint("user_id", "kind", "ref_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String)  # lesson | tactic | club | player | glossary | history
    ref_id: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)


class Match(Base):
    """Live/cached fixture or result. Always carries source + freshness."""
    __tablename__ = "matches"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # "<provider>:<external id>"
    competition_id: Mapped[str] = mapped_column(ForeignKey("competitions.id"), index=True)
    season: Mapped[str | None] = mapped_column(String, nullable=True)  # "2025"
    matchday: Mapped[int | None] = mapped_column(Integer, nullable=True)
    kickoff_utc: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, index=True)
    status: Mapped[str] = mapped_column(String)  # SCHEDULED, LIVE, FINISHED, POSTPONED...
    home_club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True, index=True)
    away_club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True, index=True)
    home_name: Mapped[str] = mapped_column(String)
    away_name: Mapped[str] = mapped_column(String)
    home_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    away_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source: Mapped[str] = mapped_column(String)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=now)


class StandingRow(Base):
    __tablename__ = "standings"
    __table_args__ = (UniqueConstraint("competition_id", "season", "team_name"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    competition_id: Mapped[str] = mapped_column(ForeignKey("competitions.id"), index=True)
    season: Mapped[str] = mapped_column(String)
    position: Mapped[int] = mapped_column(Integer)
    club_id: Mapped[str | None] = mapped_column(ForeignKey("clubs.id"), nullable=True)
    team_name: Mapped[str] = mapped_column(String)
    played: Mapped[int] = mapped_column(Integer)
    won: Mapped[int] = mapped_column(Integer)
    drawn: Mapped[int] = mapped_column(Integer)
    lost: Mapped[int] = mapped_column(Integer)
    goals_for: Mapped[int] = mapped_column(Integer)
    goals_against: Mapped[int] = mapped_column(Integer)
    points: Mapped[int] = mapped_column(Integer)
    source: Mapped[str] = mapped_column(String)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=now)


class SyncLog(Base):
    __tablename__ = "sync_log"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    competition_id: Mapped[str] = mapped_column(String, index=True)
    kind: Mapped[str] = mapped_column(String)  # matches | standings
    ok: Mapped[bool] = mapped_column(default=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    at: Mapped[datetime] = mapped_column(DateTime, default=now)
