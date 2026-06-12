from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from schemas.inscription import InscriptionCreate, InscriptionUpdate, InscriptionOut
from database import supabase
from auth import get_current_admin
from utils import generate_matricule

router = APIRouter(prefix="/api/inscriptions", tags=["inscriptions"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_inscription(payload: InscriptionCreate):
    data = payload.model_dump()
    data["statut"] = "nouveau"
    data["matricule"] = generate_matricule("inscriptions", "F")
    result = supabase.table("inscriptions").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création")
    return result.data[0]


@router.get("", dependencies=[Depends(get_current_admin)])
async def list_inscriptions(statut: Optional[str] = None, limit: int = 50, offset: int = 0):
    query = supabase.table("inscriptions").select("*").order("created_at", desc=True).range(offset, offset + limit - 1)
    if statut:
        query = query.eq("statut", statut)
    result = query.execute()
    return result.data


@router.get("/{inscription_id}", dependencies=[Depends(get_current_admin)])
async def get_inscription(inscription_id: str):
    result = supabase.table("inscriptions").select("*").eq("id", inscription_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Inscription introuvable")
    return result.data[0]


@router.patch("/{inscription_id}", dependencies=[Depends(get_current_admin)])
async def update_inscription(inscription_id: str, payload: InscriptionUpdate):
    data = payload.model_dump(exclude_none=True)
    result = supabase.table("inscriptions").update(data).eq("id", inscription_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Inscription introuvable")
    return result.data[0]


@router.delete("/{inscription_id}", dependencies=[Depends(get_current_admin)], status_code=status.HTTP_204_NO_CONTENT)
async def delete_inscription(inscription_id: str):
    supabase.table("inscriptions").delete().eq("id", inscription_id).execute()
