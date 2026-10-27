from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app import models, schemas
from app.history_data import ERAS

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("")
async def history(category: str | None = None, era: str | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(models.HistoryEvent).order_by(models.HistoryEvent.year, models.HistoryEvent.title)
    if category:
        stmt = stmt.where(models.HistoryEvent.category == category)
    if era:
        stmt = stmt.where(models.HistoryEvent.era == era)
    rows = (await db.execute(stmt)).scalars().all()
    return {"eras": ERAS, "events": [schemas.HistoryEventOut.model_validate(r) for r in rows]}
