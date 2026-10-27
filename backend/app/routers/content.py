from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api", tags=["content"])


@router.get("/glossary", response_model=list[schemas.GlossaryTermOut])
async def list_glossary(category: str | None = None, q: str | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(models.GlossaryTerm)
    if category:
        stmt = stmt.where(models.GlossaryTerm.category == category)
    if q:
        stmt = stmt.where(models.GlossaryTerm.term.ilike(f"%{q}%"))
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/glossary/{term_id}", response_model=schemas.GlossaryTermOut)
async def get_glossary_term(term_id: str, db: AsyncSession = Depends(get_db)):
    term = await db.get(models.GlossaryTerm, term_id)
    if not term:
        raise HTTPException(404, "Term not found")
    return term


@router.get("/lessons", response_model=list[schemas.LessonTopicOut])
async def list_lessons(level: int | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(models.LessonTopic).order_by(models.LessonTopic.level, models.LessonTopic.order)
    if level:
        stmt = stmt.where(models.LessonTopic.level == level)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/lessons/{lesson_id}", response_model=schemas.LessonTopicOut)
async def get_lesson(lesson_id: str, db: AsyncSession = Depends(get_db)):
    lesson = await db.get(models.LessonTopic, lesson_id)
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return lesson


@router.get("/search")
async def search(q: str, db: AsyncSession = Depends(get_db)):
    if not q or len(q) < 2:
        return {"clubs": [], "players": [], "competitions": [], "glossary": [], "lessons": [], "history": []}
    like = f"%{q}%"
    clubs = (await db.execute(select(models.Club).where(models.Club.name.ilike(like)))).scalars().all()
    players = (await db.execute(select(models.Player).where(models.Player.name.ilike(like)))).scalars().all()
    comps = (await db.execute(select(models.Competition).where(models.Competition.name.ilike(like)))).scalars().all()
    gloss = (await db.execute(select(models.GlossaryTerm).where(models.GlossaryTerm.term.ilike(like)))).scalars().all()
    lessons = (await db.execute(select(models.LessonTopic).where(models.LessonTopic.title.ilike(like)))).scalars().all()
    hist = (await db.execute(select(models.HistoryEvent).where(
        models.HistoryEvent.title.ilike(like) | models.HistoryEvent.summary.ilike(like)).limit(8))).scalars().all()
    return {
        "history": [schemas.HistoryEventOut.model_validate(h) for h in hist],
        "clubs": [schemas.ClubListOut.model_validate(c) for c in clubs],
        "players": [schemas.PlayerListOut.model_validate(p) for p in players],
        "competitions": [schemas.CompetitionOut.model_validate(c) for c in comps],
        "glossary": [schemas.GlossaryTermOut.model_validate(g) for g in gloss],
        "lessons": [schemas.LessonTopicOut.model_validate(l) for l in lessons],
    }
