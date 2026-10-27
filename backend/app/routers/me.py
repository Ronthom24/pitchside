from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.timeutil import utcnow
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app import models
from app.security import current_user

router = APIRouter(prefix="/api/me", tags=["me"])


@router.get("")
async def my_state(user: models.User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    follows = (await db.execute(
        select(models.UserFollowedClub).where(models.UserFollowedClub.user_id == user.id)
    )).scalars().all()
    progress = (await db.execute(
        select(models.LessonProgress).where(models.LessonProgress.user_id == user.id)
    )).scalars().all()
    marks = (await db.execute(
        select(models.Bookmark).where(models.Bookmark.user_id == user.id).order_by(models.Bookmark.created_at.desc())
    )).scalars().all()
    return {
        "user": {"id": user.id, "email": user.email, "display_name": user.display_name},
        "followed_clubs": [{"club_id": f.club_id, "is_primary": f.is_primary} for f in follows],
        "progress": [
            {"lesson_id": p.lesson_id, "completed": p.completed_at is not None, "best_quiz_score": p.best_quiz_score}
            for p in progress
        ],
        "bookmarks": [{"kind": b.kind, "ref_id": b.ref_id} for b in marks],
    }


@router.put("/follows/{club_id}")
async def follow_club(club_id: str, primary: bool = False, user: models.User = Depends(current_user),
                      db: AsyncSession = Depends(get_db)):
    if not await db.get(models.Club, club_id):
        raise HTTPException(404, "Club not found")
    row = (await db.execute(select(models.UserFollowedClub).where(
        models.UserFollowedClub.user_id == user.id, models.UserFollowedClub.club_id == club_id))).scalar_one_or_none()
    has_any = (await db.execute(select(models.UserFollowedClub).where(
        models.UserFollowedClub.user_id == user.id))).first() is not None
    if not row:
        row = models.UserFollowedClub(user_id=user.id, club_id=club_id, is_primary=(primary or not has_any))
        db.add(row)
    if primary:
        for other in (await db.execute(select(models.UserFollowedClub).where(
                models.UserFollowedClub.user_id == user.id))).scalars().all():
            other.is_primary = False
        row.is_primary = True
    await db.commit()
    return {"club_id": club_id, "is_primary": row.is_primary}


@router.delete("/follows/{club_id}")
async def unfollow_club(club_id: str, user: models.User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(delete(models.UserFollowedClub).where(
        models.UserFollowedClub.user_id == user.id, models.UserFollowedClub.club_id == club_id))
    await db.commit()
    rest = (await db.execute(select(models.UserFollowedClub).where(
        models.UserFollowedClub.user_id == user.id))).scalars().all()
    if rest and not any(r.is_primary for r in rest):
        rest[0].is_primary = True
        await db.commit()
    return {"ok": True}


class ProgressIn(BaseModel):
    completed: bool = True
    quiz_score: float | None = Field(default=None, ge=0, le=1)


@router.put("/progress/{lesson_id}")
async def set_progress(lesson_id: str, body: ProgressIn, user: models.User = Depends(current_user),
                       db: AsyncSession = Depends(get_db)):
    if not await db.get(models.LessonTopic, lesson_id):
        raise HTTPException(404, "Lesson not found")
    row = (await db.execute(select(models.LessonProgress).where(
        models.LessonProgress.user_id == user.id, models.LessonProgress.lesson_id == lesson_id))).scalar_one_or_none()
    if not row:
        row = models.LessonProgress(user_id=user.id, lesson_id=lesson_id)
        db.add(row)
    if body.completed and not row.completed_at:
        row.completed_at = utcnow()
    if body.quiz_score is not None:
        row.best_quiz_score = max(row.best_quiz_score or 0, body.quiz_score)
    await db.commit()
    return {"lesson_id": lesson_id, "completed": row.completed_at is not None, "best_quiz_score": row.best_quiz_score}


class BookmarkIn(BaseModel):
    kind: str = Field(pattern="^(lesson|tactic|club|player|glossary|history)$")
    ref_id: str = Field(max_length=120)


@router.post("/bookmarks")
async def add_bookmark(body: BookmarkIn, user: models.User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    exists = (await db.execute(select(models.Bookmark).where(
        models.Bookmark.user_id == user.id, models.Bookmark.kind == body.kind,
        models.Bookmark.ref_id == body.ref_id))).scalar_one_or_none()
    if not exists:
        db.add(models.Bookmark(user_id=user.id, kind=body.kind, ref_id=body.ref_id))
        await db.commit()
    return {"ok": True}


@router.delete("/bookmarks/{kind}/{ref_id}")
async def remove_bookmark(kind: str, ref_id: str, user: models.User = Depends(current_user),
                          db: AsyncSession = Depends(get_db)):
    await db.execute(delete(models.Bookmark).where(
        models.Bookmark.user_id == user.id, models.Bookmark.kind == kind, models.Bookmark.ref_id == ref_id))
    await db.commit()
    return {"ok": True}
