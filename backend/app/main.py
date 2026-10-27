import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clubs, players, competitions, content, auth, me, live, history

app = FastAPI(title="Pitchside API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5174,http://127.0.0.1:5174").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clubs.router)
app.include_router(players.router)
app.include_router(competitions.router)
app.include_router(content.router)
app.include_router(auth.router)
app.include_router(me.router)
app.include_router(live.router)
app.include_router(history.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
