import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite+aiosqlite:///./pitchside_dev.db"

# Accept a plain Neon/Postgres URL and switch it to the asyncpg driver.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql+asyncpg://" + DATABASE_URL[len("postgres://"):]
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = "postgresql+asyncpg://" + DATABASE_URL[len("postgresql://"):]

# asyncpg takes ssl=..., not libpq's sslmode=...; Neon strings often include sslmode/channel_binding.
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("sslmode=", "ssl=").replace("&channel_binding=require", "").replace("?channel_binding=require&", "?")

connect_args: dict = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif "-pooler" in DATABASE_URL:
    # Neon's pooler runs pgbouncer in transaction mode, which does not support asyncpg prepared statements.
    connect_args = {"statement_cache_size": 0}

_sqlite = DATABASE_URL.startswith("sqlite")
# SQLite is a local file: no pooling, so connections are never shared across event loops.
engine = create_async_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=not _sqlite,
                             **({"poolclass": NullPool} if _sqlite else {}))
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as session:
        yield session
