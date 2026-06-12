from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import Optional
from database import supabase
from auth import get_current_admin
from config import settings
from utils import generate_matricule
import uuid

router = APIRouter(prefix="/api/candidatures", tags=["candidatures"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_candidature(
    nom: str = Form(...),
    prenom: str = Form(...),
    email: str = Form(...),
    telephone: str = Form(...),
    poste_vise: str = Form(...),
    annees_experience: str = Form(...),
    matieres: str = Form(...),
    motivation: str = Form(...),
    niveau_service: str = Form(default=""),
    cv: Optional[UploadFile] = File(default=None),
):
    cv_url = None
    if cv is not None:
        file_bytes = await cv.read()
        safe_name = (cv.filename or "cv.pdf").replace(" ", "_")
        file_name = f"cvs/{uuid.uuid4()}-{safe_name}"

        # Auto-créer le bucket s'il n'existe pas
        try:
            supabase.storage.create_bucket("candidatures", options={"public": True})
        except Exception:
            pass  # Déjà existant

        try:
            supabase.storage.from_("candidatures").upload(
                file_name, file_bytes,
                {"content-type": cv.content_type or "application/pdf"},
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Impossible d'envoyer le CV : {str(e)}"
            )

        cv_url = f"{settings.supabase_url}/storage/v1/object/public/candidatures/{file_name}"

    data = {
        "nom": nom,
        "prenom": prenom,
        "email": email,
        "telephone": telephone,
        "poste_vise": poste_vise,
        "annees_experience": annees_experience,
        "matieres": matieres,
        "motivation": motivation,
        "niveau_service": niveau_service,
        "cv_url": cv_url,
        "statut": "nouveau",
        "matricule": generate_matricule("candidatures", "E"),
    }

    result = supabase.table("candidatures").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création")
    return result.data[0]


@router.get("", dependencies=[Depends(get_current_admin)])
async def list_candidatures(statut: Optional[str] = None):
    query = supabase.table("candidatures").select("*").order("created_at", desc=True)
    if statut:
        query = query.eq("statut", statut)
    return query.execute().data


@router.get("/{candidature_id}", dependencies=[Depends(get_current_admin)])
async def get_candidature(candidature_id: str):
    result = supabase.table("candidatures").select("*").eq("id", candidature_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    return result.data[0]


@router.patch("/{candidature_id}/statut", dependencies=[Depends(get_current_admin)])
async def update_statut(candidature_id: str, statut: str):
    result = supabase.table("candidatures").update({"statut": statut}).eq("id", candidature_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    return result.data[0]
