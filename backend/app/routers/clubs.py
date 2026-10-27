from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/clubs", tags=["clubs"])


@router.get("", response_model=list[schemas.ClubListOut])
async def list_clubs(
    country: str | None = None,
    competition: str | None = None,
    tag: str | None = None,
    q: str | None = Query(None, description="Search by name"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(models.Club)
    if country:
        stmt = stmt.where(models.Club.country_id == country)
    if competition:
        stmt = stmt.where(models.Club.current_competition_id == competition)
    if q:
        stmt = stmt.where(models.Club.name.ilike(f"%{q}%"))
    result = await db.execute(stmt)
    clubs = list(result.scalars().all())
    if tag:
        clubs = [c for c in clubs if c.identity_tags and tag in c.identity_tags]
    return clubs


@router.get("/{club_id}", response_model=schemas.ClubDetailOut)
async def get_club(club_id: str, db: AsyncSession = Depends(get_db)):
    club = await db.get(models.Club, club_id)
    if not club:
        raise HTTPException(404, "Club not found")

    honours = (await db.execute(select(models.Honour).where(models.Honour.club_id == club_id))).scalars().all()
    rivalries = (await db.execute(
        select(models.Rivalry).where(
            (models.Rivalry.club_a_id == club_id) | (models.Rivalry.club_b_id == club_id)
        )
    )).scalars().all()
    timeline = (await db.execute(
        select(models.ClubTimelineEvent).where(models.ClubTimelineEvent.club_id == club_id).order_by(models.ClubTimelineEvent.year)
    )).scalars().all()

    data = schemas.ClubDetailOut.model_validate(club)
    if club.stadium_id:
        stadium = await db.get(models.Stadium, club.stadium_id)
        data.stadium = schemas.StadiumOut.model_validate(stadium) if stadium else None
    if club.current_manager_id:
        manager = await db.get(models.Manager, club.current_manager_id)
        data.manager = schemas.ManagerOut.model_validate(manager) if manager else None
    if club.country_id:
        country = await db.get(models.Country, club.country_id)
        data.country_name = country.name if country else None
    if club.current_competition_id:
        comp = await db.get(models.Competition, club.current_competition_id)
        data.competition_name = comp.name if comp else None
    data.honours = [schemas.HonourOut.model_validate(h) for h in honours]
    data.rivalries = [schemas.RivalryOut.model_validate(r) for r in rivalries]
    data.timeline = [schemas.ClubTimelineEventOut.model_validate(t) for t in timeline]
    return data


@router.get("/{club_id}/squad", response_model=list[schemas.PlayerListOut])
async def get_club_squad(club_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Player).where(models.Player.current_club_id == club_id))
    return list(result.scalars().all())


@router.post("/match")
async def match_clubs(preferences: dict, db: AsyncSession = Depends(get_db)):
    """
    Find Your Club: transparent tag-based matching.
    `preferences` is a dict of {tag: True} for selected identity tags
    (e.g. {"historic": true, "attacking": true, "premier-league": true}).
    Returns clubs ranked by how many selected tags they match, with the matched tags shown.
    """
    wanted = [t for t, v in preferences.items() if v]
    result = await db.execute(select(models.Club))
    clubs = result.scalars().all()
    scored = []
    for c in clubs:
        club_tags = set(c.identity_tags or [])
        matched = [t for t in wanted if t in club_tags]
        if matched:
            scored.append({
                "club": schemas.ClubListOut.model_validate(c).model_dump(),
                "matched_tags": matched,
                "match_score": len(matched),
            })
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:10]


@router.get("/{club_id}/alumni")
async def get_club_alumni(club_id: str, db: AsyncSession = Depends(get_db)):
    """Players (current or former) whose recorded career includes this club."""
    stints = (await db.execute(
        select(models.PlayerClubHistory).where(models.PlayerClubHistory.club_id == club_id)
        .order_by(models.PlayerClubHistory.start_year)
    )).scalars().all()
    out = []
    for s in stints:
        player = await db.get(models.Player, s.player_id)
        if player:
            out.append({"player": schemas.PlayerListOut.model_validate(player).model_dump(mode="json"),
                        "start_year": s.start_year, "end_year": s.end_year})
    return out
