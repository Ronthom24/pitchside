from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import models, schemas
from app.services.football import service

router = APIRouter(prefix="/api/competitions", tags=["competitions"])


def _out(c: models.Competition) -> schemas.CompetitionOut:
    out = schemas.CompetitionOut.model_validate(c)
    out.live_data_available = service.live_data_available(c)
    return out


@router.get("", response_model=list[schemas.CompetitionOut])
async def list_competitions(category: str | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(models.Competition)
    if category:
        stmt = stmt.where(models.Competition.category == category)
    result = await db.execute(stmt)
    return [_out(c) for c in result.scalars().all()]


@router.get("/{competition_id}", response_model=schemas.CompetitionOut)
async def get_competition(competition_id: str, db: AsyncSession = Depends(get_db)):
    comp = await db.get(models.Competition, competition_id)
    if not comp:
        raise HTTPException(404, "Competition not found")
    return _out(comp)


@router.get("/{competition_id}/clubs", response_model=list[schemas.ClubListOut])
async def get_competition_clubs(competition_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Club).where(models.Club.current_competition_id == competition_id))
    return list(result.scalars().all())
