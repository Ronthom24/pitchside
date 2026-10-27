import asyncio
import os
import tempfile

import pytest

# Must be set before the app is imported so the engine binds to a throwaway database.
_tmp = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_tmp}/test.db"
os.environ["FOOTBALL_API_KEY"] = ""

from fastapi.testclient import TestClient  # noqa: E402

from app.timeutil import utcnow
from app.main import app  # noqa: E402
from app import seed  # noqa: E402
from app.services.football import service  # noqa: E402


@pytest.fixture(scope="session")
def client():
    asyncio.run(seed.run())
    with TestClient(app) as c:
        yield c


def register(client, email, password="a-good-password"):
    r = client.post("/api/auth/register", json={"email": email, "password": password, "display_name": "T"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_clubs_and_detail(client):
    clubs = client.get("/api/clubs").json()
    assert len(clubs) >= 40
    arsenal = client.get("/api/clubs/arsenal").json()
    assert arsenal["stadium"]["name"] == "Emirates Stadium"
    assert arsenal["country_name"] == "England"
    assert all(h["as_of"] for h in arsenal["honours"])
    assert client.get("/api/clubs/does-not-exist").status_code == 404


def test_player_career_and_relationships(client):
    p = client.get("/api/players/lionel-messi").json()
    assert p["current_club"]["id"] == "inter-miami"
    assert [c["club_name"] for c in p["career"]][0] == "Barcelona"
    squad_ids = {x["id"] for x in client.get("/api/clubs/liverpool/squad").json()}
    assert "mohamed-salah" in squad_ids
    retired = client.get("/api/players/pele").json()
    assert retired["current_club"] is None and retired["death_date"] == "2022-12-29"


def test_find_your_club_is_transparent(client):
    res = client.post("/api/clubs/match", json={"historic": True, "isl": True, "attacking": False}).json()
    assert res, "expected matches"
    top = res[0]
    assert set(top["matched_tags"]) <= {"historic", "isl"}
    assert top["match_score"] == len(top["matched_tags"])
    assert top["club"]["id"] in {"mohun-bagan-super-giant", "east-bengal"}


def test_search_covers_history_and_clubs(client):
    r = client.get("/api/search", params={"q": "Madrid"}).json()
    assert any(c["id"] == "real-madrid" for c in r["clubs"])
    assert "history" in r


def test_auth_rules(client):
    h = register(client, "dupe@example.com")
    assert client.post("/api/auth/register", json={"email": "DUPE@example.com", "password": "a-good-password"}).status_code == 409
    assert client.post("/api/auth/register", json={"email": "x@example.com", "password": "short"}).status_code == 422
    assert client.post("/api/auth/login", json={"email": "dupe@example.com", "password": "wrong-password"}).status_code == 401
    assert client.post("/api/auth/login", json={"email": "dupe@example.com", "password": "a-good-password"}).status_code == 200
    assert client.get("/api/me").status_code == 401
    assert client.get("/api/me", headers={"Authorization": "Bearer garbage"}).status_code == 401
    assert client.get("/api/me", headers=h).json()["user"]["email"] == "dupe@example.com"


def test_follow_primary_and_unfollow(client):
    h = register(client, "follow@example.com")
    assert client.put("/api/me/follows/arsenal", headers=h).json()["is_primary"] is True
    assert client.put("/api/me/follows/barcelona", headers=h).json()["is_primary"] is False
    client.put("/api/me/follows/barcelona?primary=true", headers=h)
    state = {f["club_id"]: f["is_primary"] for f in client.get("/api/me", headers=h).json()["followed_clubs"]}
    assert state == {"arsenal": False, "barcelona": True}
    client.delete("/api/me/follows/barcelona", headers=h)
    state = client.get("/api/me", headers=h).json()["followed_clubs"]
    assert state == [{"club_id": "arsenal", "is_primary": True}]
    assert client.put("/api/me/follows/not-a-club", headers=h).status_code == 404


def test_users_cannot_see_each_others_data(client):
    a, b = register(client, "a@example.com"), register(client, "b@example.com")
    client.put("/api/me/follows/arsenal", headers=a)
    client.put("/api/me/progress/offside", headers=a, json={"completed": True, "quiz_score": 1})
    other = client.get("/api/me", headers=b).json()
    assert other["followed_clubs"] == [] and other["progress"] == []


def test_progress_keeps_best_score_and_bookmarks_validate(client):
    h = register(client, "progress@example.com")
    client.put("/api/me/progress/offside", headers=h, json={"completed": True, "quiz_score": 0.9})
    r = client.put("/api/me/progress/offside", headers=h, json={"completed": True, "quiz_score": 0.3}).json()
    assert r["best_quiz_score"] == 0.9
    assert client.put("/api/me/progress/offside", headers=h, json={"quiz_score": 5}).status_code == 422
    assert client.put("/api/me/progress/nope", headers=h, json={}).status_code == 404
    assert client.post("/api/me/bookmarks", headers=h, json={"kind": "tactic", "ref_id": "false-nine"}).status_code == 200
    assert client.post("/api/me/bookmarks", headers=h, json={"kind": "bogus", "ref_id": "x"}).status_code == 422
    marks = client.get("/api/me", headers=h).json()["bookmarks"]
    assert marks == [{"kind": "tactic", "ref_id": "false-nine"}]


def test_live_data_without_key_says_so_plainly(client):
    r = client.get("/api/live/competitions/premier-league/standings").json()
    assert r["live_available"] is True and r["rows"] == []
    assert "FOOTBALL_API_KEY" in r["error"]
    unmapped = client.get("/api/live/competitions/isl/standings").json()
    assert unmapped["live_available"] is False and unmapped["error"] is None


@pytest.mark.parametrize("provider_name,club_id", [
    ("Arsenal FC", "arsenal"), ("Manchester United FC", "manchester-united"), ("FC Internazionale Milano", "inter-milan"),
    ("AC Milan", "ac-milan"), ("Club Atlético de Madrid", "atletico-madrid"), ("FC Bayern München", "bayern-munich"),
    ("Paris Saint-Germain FC", "paris-saint-germain"), ("Real Madrid CF", "real-madrid"), ("FC Barcelona", "barcelona"),
    ("Borussia Dortmund", "borussia-dortmund"),
])
def test_provider_team_names_map_to_our_clubs(client, provider_name, club_id):
    from app.database import SessionLocal

    async def go():
        async with SessionLocal() as db:
            lookup = await service._club_lookup(db)
            return service._match_club(provider_name, lookup)

    assert asyncio.run(go()) == club_id


def test_unknown_team_is_not_force_matched(client):
    from app.database import SessionLocal

    async def go():
        async with SessionLocal() as db:
            return service._match_club("Wolverhampton Wanderers FC", await service._club_lookup(db))

    assert asyncio.run(go()) is None


# ---------------------------------------------------------------- live-data pipeline (fake provider)
from datetime import datetime, timedelta  # noqa: E402
from app.services.football.base import MatchDTO, StandingDTO, ProviderUnavailable  # noqa: E402


class FakeProvider:
    name = "fake-provider"

    def __init__(self):
        self.calls = {"matches": 0, "standings": 0}
        self.fail = False

    def supports(self, ext):
        return bool(ext)

    async def fetch_matches(self, ext):
        self.calls["matches"] += 1
        if self.fail:
            raise ProviderUnavailable("Rate limited by fake-provider")
        future = utcnow() + timedelta(days=3)
        past = utcnow() - timedelta(days=3)
        return [
            MatchDTO("1", "2025", 10, past, "FINISHED", "Arsenal FC", "Chelsea FC", 2, 1),
            MatchDTO("2", "2025", 11, future, "TIMED", "Liverpool FC", "Arsenal FC", None, None),
            MatchDTO("3", "2025", 11, future, "TIMED", "Wolverhampton Wanderers FC", "Chelsea FC", None, None),
        ]

    async def fetch_standings(self, ext):
        self.calls["standings"] += 1
        if self.fail:
            raise ProviderUnavailable("Rate limited by fake-provider")
        return [StandingDTO("2025", 1, "Arsenal FC", 10, 8, 1, 1, 20, 6, 25),
                StandingDTO("2025", 2, "Wolverhampton Wanderers FC", 10, 1, 2, 7, 5, 19, 5)]


@pytest.fixture()
def fake_provider(client):
    fake = FakeProvider()
    service.PROVIDERS.insert(0, fake)
    yield fake
    service.PROVIDERS.remove(fake)


def _reset_sync_state():
    from sqlalchemy import delete
    from app.database import SessionLocal
    from app import models

    async def go():
        async with SessionLocal() as db:
            for m in (models.SyncLog, models.Match, models.StandingRow):
                await db.execute(delete(m))
            await db.commit()
    asyncio.run(go())


def test_live_sync_stores_data_with_source_and_freshness(client, fake_provider):
    _reset_sync_state()
    st = client.get("/api/live/competitions/premier-league/standings").json()
    assert st["error"] is None and st["source"] == "fake-provider" and st["updated_at"]
    assert [r["team_name"] for r in st["rows"]] == ["Arsenal FC", "Wolverhampton Wanderers FC"]
    assert st["rows"][0]["club_id"] == "arsenal" and st["rows"][1]["club_id"] is None  # unknown team stays unlinked

    m = client.get("/api/live/competitions/premier-league/matches").json()
    assert len(m["recent"]) == 1 and m["recent"][0]["home_score"] == 2
    assert len(m["upcoming"]) == 2

    club = client.get("/api/live/clubs/arsenal/matches").json()
    assert club["league_position"]["position"] == 1
    assert {x["id"] for x in club["upcoming"]} == {"fake-provider:2"}
    assert len(club["recent"]) == 1


def test_live_sync_respects_ttl_so_page_views_do_not_hit_the_provider(client, fake_provider):
    _reset_sync_state()
    for _ in range(5):
        client.get("/api/live/competitions/premier-league/standings")
    assert fake_provider.calls["standings"] == 1


def test_provider_failure_keeps_cached_data_and_reports_error(client, fake_provider):
    _reset_sync_state()
    client.get("/api/live/competitions/premier-league/matches")
    assert fake_provider.calls["matches"] == 1
    # Age the successful sync past its TTL and the failed-attempt backoff, then make the provider fail.
    from sqlalchemy import update
    from app.database import SessionLocal
    from app import models

    async def age():
        async with SessionLocal() as db:
            await db.execute(update(models.SyncLog).values(at=utcnow() - timedelta(hours=3)))
            await db.commit()
    asyncio.run(age())
    fake_provider.fail = True
    r = client.get("/api/live/competitions/premier-league/matches").json()
    assert "Rate limited" in r["error"]
    assert len(r["recent"]) == 1 and r["updated_at"]  # stale data still served, with its real timestamp
    client.get("/api/live/competitions/premier-league/matches")
    assert fake_provider.calls["matches"] == 2  # failed attempt backs off instead of hammering the provider
