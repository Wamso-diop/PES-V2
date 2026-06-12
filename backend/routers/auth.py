from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from database import supabase
from auth import verify_password, hash_password, create_access_token
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Code secret requis pour créer un compte admin
ADMIN_INVITE_CODE = settings.admin_invite_code


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    password: str
    code_secret: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    result = supabase.table("admins").select("*").eq("email", payload.email).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")

    admin = result.data
    if not verify_password(payload.password, admin["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")

    token = create_access_token({"sub": admin["id"], "email": admin["email"], "role": "admin"})
    return TokenResponse(access_token=token)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    if payload.code_secret != ADMIN_INVITE_CODE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Code secret invalide")

    existing = supabase.table("admins").select("id").eq("email", payload.email).execute()
    if existing.data:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un compte existe déjà avec cet email")

    password_hash = hash_password(payload.password)
    result = supabase.table("admins").insert({
        "nom": payload.nom,
        "prenom": payload.prenom,
        "email": payload.email,
        "password_hash": password_hash,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du compte")

    admin = result.data[0]
    token = create_access_token({"sub": admin["id"], "email": admin["email"], "role": "admin"})
    return TokenResponse(access_token=token)
