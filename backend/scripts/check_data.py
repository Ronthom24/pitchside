"""Validate cross-references in the seed data. Run from backend/:  python -m scripts.check_data
Exits non-zero on any broken reference, so it can run in CI."""
import sys

from app import seed_data as base, seed_more as more
from app.seed import by_id
from app.lessons_data import LESSONS
from app.glossary_data import GLOSSARY
from app.history_data import HISTORY, ERAS

errors: list[str] = []


def check(cond: bool, msg: str) -> None:
    if not cond:
        errors.append(msg)


countries = {c["id"] for c in by_id(base.COUNTRIES, more.COUNTRIES)}
stadiums = {s["id"] for s in by_id(base.STADIUMS, more.STADIUMS)}
comps = {c["id"] for c in base.COMPETITIONS}
managers = {m["id"] for m in by_id(base.MANAGERS, more.MANAGERS)}
clubs = by_id(base.CLUBS, more.CLUBS)
club_ids = {c["id"] for c in clubs}
players = by_id(base.PLAYERS, more.PLAYERS)
player_ids = {p["id"] for p in players}
terms = {g["id"] for g in by_id(base.GLOSSARY, GLOSSARY)}
eras = {e["id"] for e in ERAS}

for c in clubs:
    check(c.get("country_id") in countries, f"club {c['id']}: unknown country {c.get('country_id')}")
    if c.get("stadium_id"):
        check(c["stadium_id"] in stadiums, f"club {c['id']}: unknown stadium {c['stadium_id']}")
    if c.get("current_competition_id"):
        check(c["current_competition_id"] in comps, f"club {c['id']}: unknown competition {c['current_competition_id']}")
    if c.get("current_manager_id"):
        check(c["current_manager_id"] in managers, f"club {c['id']}: unknown manager {c['current_manager_id']}")
    check(bool(c.get("founded_year")), f"club {c['id']}: missing founded_year")
for s in by_id(base.STADIUMS, more.STADIUMS):
    check(s.get("country_id") in countries, f"stadium {s['id']}: unknown country")
for p in players:
    check(p.get("nationality_id") in countries, f"player {p['id']}: unknown nationality {p.get('nationality_id')}")
    if p.get("current_club_id"):
        check(p["current_club_id"] in club_ids, f"player {p['id']}: unknown club {p['current_club_id']}")
        check(not p.get("is_retired"), f"player {p['id']}: retired but has a current club")
for m in by_id(base.MANAGERS, more.MANAGERS):
    check(m.get("nationality_id") in countries, f"manager {m['id']}: unknown nationality")
for h in base.HONOURS:
    check(h["club_id"] in club_ids, f"honour: unknown club {h['club_id']}")
    check(bool(h.get("as_of")), f"honour {h['club_id']}/{h['competition_name']}: missing as_of")
for r in base.RIVALRIES + more.RIVALRIES:
    check(r["club_a_id"] in club_ids and r["club_b_id"] in club_ids, f"rivalry {r['club_a_id']}/{r['club_b_id']}: unknown club")
for t in base.TIMELINE:
    check(t["club_id"] in club_ids, f"timeline: unknown club {t['club_id']}")
for pid, stints in more.CAREERS.items():
    check(pid in player_ids, f"career: unknown player {pid}")
    for name, cid, start, end in stints:
        check(cid is None or cid in club_ids, f"career {pid}/{name}: unknown club {cid}")
        check(end is None or end >= start, f"career {pid}/{name}: end before start")
for l in LESSONS:
    for tid in l.get("related_glossary_ids", []):
        check(tid in terms, f"lesson {l['id']}: unknown glossary term {tid}")
    for q in l.get("quiz", []) or []:
        check(0 <= q["answer"] < len(q["options"]), f"lesson {l['id']}: quiz answer out of range")
check(len({l["id"] for l in LESSONS}) == len(LESSONS), "duplicate lesson ids")
for g in by_id(base.GLOSSARY, GLOSSARY):
    for rid in g.get("related_terms") or []:
        check(rid in terms, f"glossary {g['id']}: unknown related term {rid}")
for e in HISTORY:
    check(e["era"] in eras, f"history {e['id']}: unknown era {e['era']}")
    for cid in e["related_club_ids"]:
        check(cid in club_ids, f"history {e['id']}: unknown club {cid}")
    for cid in e["related_competition_ids"]:
        check(cid in comps, f"history {e['id']}: unknown competition {cid}")
check(len({e["id"] for e in HISTORY}) == len(HISTORY), "duplicate history ids")

if errors:
    print(f"{len(errors)} problem(s):")
    print("\n".join(" - " + e for e in errors))
    sys.exit(1)
print(f"OK: {len(clubs)} clubs, {len(players)} players, {len(LESSONS)} lessons, {len(terms)} terms, {len(HISTORY)} history events; all references resolve.")
