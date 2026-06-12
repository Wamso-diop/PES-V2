from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from database import supabase
from auth import get_current_admin
from config import settings
import uuid

router = APIRouter(prefix="/api/articles", tags=["blog"])


class ArticleCreate(BaseModel):
    titre_fr: str
    titre_en: Optional[str] = None
    slug: str
    excerpt_fr: str
    excerpt_en: Optional[str] = None
    contenu_fr: str
    contenu_en: Optional[str] = None
    categorie: str
    auteur: str = "PES"
    statut: str = "brouillon"
    reading_time: int = 5
    youtube_url: Optional[str] = None
    audio_url: Optional[str] = None


class ArticleUpdate(BaseModel):
    titre_fr: Optional[str] = None
    titre_en: Optional[str] = None
    excerpt_fr: Optional[str] = None
    excerpt_en: Optional[str] = None
    contenu_fr: Optional[str] = None
    contenu_en: Optional[str] = None
    categorie: Optional[str] = None
    statut: Optional[str] = None
    reading_time: Optional[int] = None
    youtube_url: Optional[str] = None
    audio_url: Optional[str] = None


@router.get("")
async def list_articles(limit: int = 20, offset: int = 0):
    result = (
        supabase.table("articles")
        .select("id, slug, titre_fr, titre_en, excerpt_fr, excerpt_en, cover_image_url, categorie, auteur, published_at, reading_time, youtube_url, audio_url")
        .eq("statut", "publié")
        .order("published_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return result.data


@router.get("/admin/all", dependencies=[Depends(get_current_admin)])
async def list_articles_admin():
    result = (
        supabase.table("articles")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/{slug}")
async def get_article(slug: str):
    result = (
        supabase.table("articles")
        .select("*")
        .eq("slug", slug)
        .eq("statut", "publié")
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return result.data[0]


@router.post("", dependencies=[Depends(get_current_admin)], status_code=status.HTTP_201_CREATED)
async def create_article(payload: ArticleCreate):
    existing = supabase.table("articles").select("id").eq("slug", payload.slug).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Ce slug est déjà utilisé")
    data = payload.model_dump()
    if data.get("statut") == "publié":
        data["published_at"] = datetime.now(timezone.utc).isoformat()
    result = supabase.table("articles").insert(data).execute()
    return result.data[0]


@router.patch("/{article_id}", dependencies=[Depends(get_current_admin)])
async def update_article(article_id: str, payload: ArticleUpdate):
    data = payload.model_dump(exclude_none=True)
    if data.get("statut") == "publié":
        current = supabase.table("articles").select("published_at").eq("id", article_id).execute()
        if current.data and not current.data[0].get("published_at"):
            data["published_at"] = datetime.now(timezone.utc).isoformat()
    result = supabase.table("articles").update(data).eq("id", article_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return result.data[0]


@router.delete("/{article_id}", dependencies=[Depends(get_current_admin)], status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: str):
    supabase.table("articles").delete().eq("id", article_id).execute()


@router.post("/{article_id}/cover", dependencies=[Depends(get_current_admin)])
async def upload_cover(article_id: str, file: UploadFile = File(...)):
    file_bytes = await file.read()
    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "webp", "gif", "avif"):
        ext = "jpg"
    file_name = f"blog/{article_id}/{uuid.uuid4()}.{ext}"

    # Auto-créer le bucket s'il n'existe pas encore
    try:
        supabase.storage.create_bucket("blog-images", options={"public": True})
    except Exception:
        pass  # Bucket déjà existant — on continue

    try:
        supabase.storage.from_("blog-images").upload(
            file_name,
            file_bytes,
            {"content-type": file.content_type or "image/jpeg"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Upload échoué : {str(e)} — "
                "Si le problème persiste, créez manuellement le bucket 'blog-images' "
                "(Public) dans Supabase Dashboard → Storage."
            ),
        )

    url = f"{settings.supabase_url}/storage/v1/object/public/blog-images/{file_name}"
    supabase.table("articles").update({"cover_image_url": url}).eq("id", article_id).execute()
    return {"cover_image_url": url}
