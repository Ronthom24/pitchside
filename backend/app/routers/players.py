from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/players", tags=["players"])


@router.get("", response_model=list[schemas.PlayerListOut])
async def list_players(
    club: str | None = None,
    position: str | None = None,
    q: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(models.Player)
    if club:
        stmt = stmt.where(models.Player.current_club_id == club)
    if position:
        stmt = stmt.where(models.Player.position == position)
    if q:
        stmt = stmt.where(models.Player.name.ilike(f"%{q}%"))
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{player_id}", response_model=schemas.PlayerDetailOut)
async def get_player(player_id: str, db: AsyncSession = Depends(get_db)):
    player = await db.get(models.Player, player_id)
    if not player:
        raise HTTPException(404, "Player not found")
    data = schemas.PlayerDetailOut.model_validate(player)
    if player.nationality_id:
        country = await db.get(models.Country, player.nationality_id)
        data.nationality_name = country.name if country else None
    if player.current_club_id and not player.is_retired:
        club = await db.get(models.Club, player.current_club_id)
        data.current_club = schemas.ClubListOut.model_validate(club) if club else None
    stints = (await db.execute(
        select(models.PlayerClubHistory).where(models.PlayerClubHistory.player_id == player_id)
        .order_by(models.PlayerClubHistory.start_year)
    )).scalars().all()
    data.career = [schemas.CareerStintOut(club_id=r.club_id, club_name=r.club_name,
                                          start_year=r.start_year, end_year=r.end_year) for r in stints]
    return data


@router.get("/{player_id}/career", response_model=list[dict])
async def get_player_career(player_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.PlayerClubHistory).where(models.PlayerClubHistory.player_id == player_id))
    rows = result.scalars().all()
    return [
        {
            "club_id": r.club_id, "start_year": r.start_year, "end_year": r.end_year,
            "appearances": r.appearances, "goals": r.goals, "note": r.note,
        }
        for r in rows
    ]
