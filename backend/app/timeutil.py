from datetime import datetime, timezone


def utcnow() -> datetime:
    """Naive UTC timestamp (the DB stores naive UTC; the API appends 'Z')."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
