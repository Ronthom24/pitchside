"""Idempotent seed: upserts content tables and never touches user tables (users, follows, progress, bookmarks).
Run:  python -m app.seed
"""
import asyncio
from datetime import date

from sqlalchemy import delete

from app.database import engine, SessionLocal, Base
from app import models
from app import seed_data as base
from app import seed_more as more
from app.lessons_data import LESSONS
from app.glossary_data import GLOSSARY
from app.history_data import HISTORY


def by_id(*lists):
    """Merge lists of dicts on 'id'; later lists override earlier ones."""
    out: dict[str, dict] = {}
    for lst in lists:
        for item in lst:
            out[item["id"]] = {**out.get(item["id"], {}), **item}
    return list(out.values())


def d(value):
    return date.fromisoformat(value) if isinstance(value, str) else value


async def run():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    countries = by_id(base.COUNTRIES, more.COUNTRIES)
    stadiums = by_id(base.STADIUMS, more.STADIUMS)
    managers = by_id(base.MANAGERS, more.MANAGERS)
    clubs = by_id(base.CLUBS, more.CLUBS)
    for c in clubs:
        c.setdefault("facts_as_of", more.AS_OF if c.get("current_manager_id") else None)
    players = by_id(base.PLAYERS, more.PLAYERS)
    for p in players:
        p["birth_date"] = d(p.get("birth_date"))
        p["death_date"] = d(p.get("death_date"))
    players_by_id = {p["id"] for p in players}
    # Phase 1 players with no birth date / dates added here where well documented.
    known_birth = {"lionel-messi": "1987-06-24", "cristiano-ronaldo": "1985-02-05", "kylian-mbappe": "1998-12-20",
                   "erling-haaland": "2000-07-21", "jude-bellingham": "2003-06-29", "vinicius-junior": "2000-07-12",
                   "mohamed-salah": "1992-06-15", "kevin-de-bruyne": "1991-06-28", "harry-kane": "1993-07-28",
                   "lamine-yamal": "2007-07-13", "diego-maradona": "1960-10-30", "johan-cruyff": "1947-04-25"}
    known_death = {"diego-maradona": "2020-11-25", "johan-cruyff": "2016-03-24"}
    for p in players:
        if not p.get("birth_date") and p["id"] in known_birth:
            p["birth_date"] = d(known_birth[p["id"]])
        if not p.get("death_date") and p["id"] in known_death:
            p["death_date"] = d(known_death[p["id"]])
        if p.get("current_club_id") and not p.get("facts_as_of"):
            p["facts_as_of"] = more.AS_OF

    async with SessionLocal() as db:
        # Rows with string primary keys are merged (upsert) so FK references from user data stay valid.
        for model, rows in [
            (models.Country, countries), (models.Stadium, stadiums),
            (models.Competition, base.COMPETITIONS), (models.Manager, managers),
        ]:
            for r in rows:
                await db.merge(model(**r))
        await db.commit()

        for r in clubs:
            await db.merge(models.Club(**r))
        await db.commit()

        for r in players:
            await db.merge(models.Player(**r))
        for r in by_id(LESSONS):
            await db.merge(models.LessonTopic(**r))
        for r in by_id(base.GLOSSARY, GLOSSARY):
            await db.merge(models.GlossaryTerm(**r))
        for r in HISTORY:
            await db.merge(models.HistoryEvent(**r))
        await db.commit()

        # Autoincrement-keyed content: replace wholesale (no user data references these).
        for model in (models.Honour, models.Rivalry, models.ClubTimelineEvent, models.PlayerClubHistory):
            await db.execute(delete(model))
        db.add_all(models.Honour(**h) for h in base.HONOURS)
        db.add_all(models.Rivalry(**r) for r in base.RIVALRIES + more.RIVALRIES)
        db.add_all(models.ClubTimelineEvent(**t) for t in base.TIMELINE)
        n_career = 0
        for pid, stints in more.CAREERS.items():
            assert pid in players_by_id, pid
            for name, club_id, start, end in stints:
                db.add(models.PlayerClubHistory(player_id=pid, club_id=club_id, club_name=name, start_year=start, end_year=end))
                n_career += 1
        await db.commit()

    print(f"Seeded: {len(countries)} countries, {len(stadiums)} stadiums, {len(base.COMPETITIONS)} competitions, "
          f"{len(clubs)} clubs, {len(managers)} managers, {len(players)} players, {n_career} career stints, "
          f"{len(LESSONS)} lessons, {len(by_id(base.GLOSSARY, GLOSSARY))} glossary terms, {len(HISTORY)} history events.")


if __name__ == "__main__":
    asyncio.run(run())
