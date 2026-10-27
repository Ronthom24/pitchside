from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app import models
from app.security import hash_password, verify_password, create_token, current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=60)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


def _user_out(u: models.User):
    return {"id": u.id, "email": u.email, "display_name": u.display_name}


@router.post("/register")
async def register(body: RegisterIn, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    exists = (await db.execute(select(models.User).where(models.User.email == email))).scalar_one_or_none()
    if exists:
        raise HTTPException(409, "An account with this email already exists")
    user = models.User(email=email, display_name=body.display_name, password_hash=hash_password(body.password))
    db.add(user)
    await db.commit()
    return {"token": create_token(user.id), "user": _user_out(user)}


@router.post("/login")
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(models.User).where(models.User.email == body.email.lower()))).scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Incorrect email or password")
    return {"token": create_token(user.id), "user": _user_out(user)}


@router.get("/me")
async def me(user: models.User = Depends(current_user)):
    return _user_out(user)
