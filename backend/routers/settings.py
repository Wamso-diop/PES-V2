from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from database import supabase
from auth import get_current_admin, verify_password, hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


class ProfileUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    contact_email: Optional[str] = None
    whatsapp: Optional[str] = None
    inscription_goal: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    site_url: Optional[str] = None


@router.get("/me")
async def get_me(current: dict = Depends(get_current_admin)):
    result = (
        supabase.table("admins")
        .select("id, email, nom, prenom, created_at")
        .eq("id", current["sub"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Admin introuvable")
    return result.data


@router.patch("/me")
async def update_me(payload: ProfileUpdate, current: dict = Depends(get_current_admin)):
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    if "email" in data:
        existing = supabase.table("admins").select("id").eq("email", data["email"]).execute()
        if existing.data and existing.data[0]["id"] != current["sub"]:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé par un autre compte")
    result = supabase.table("admins").update(data).eq("id", current["sub"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Admin introuvable")
    return result.data[0]


@router.post("/change-password")
async def change_password(payload: PasswordChange, current: dict = Depends(get_current_admin)):
    result = (
        supabase.table("admins")
        .select("password_hash")
        .eq("id", current["sub"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Admin introuvable")

    if not verify_password(payload.current_password, result.data["password_hash"]):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")

    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit contenir au moins 8 caractères")

    new_hash = hash_password(payload.new_password)
    supabase.table("admins").update({"password_hash": new_hash}).eq("id", current["sub"]).execute()
    return {"message": "Mot de passe modifié avec succès"}


@router.get("/settings")
async def get_settings():
    result = supabase.table("site_settings").select("*").eq("id", 1).single().execute()
    return result.data or {}


@router.put("/settings")
async def update_settings(payload: SiteSettingsUpdate, current: dict = Depends(get_current_admin)):
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    result = supabase.table("site_settings").update(data).eq("id", 1).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Impossible de sauvegarder les paramètres")
    return result.data[0]
