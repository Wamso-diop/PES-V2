from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, inscriptions, candidatures, blog
from routers import settings as settings_router

app = FastAPI(
    title="PES API",
    description="API backend du Pôle d'Excellence Scolaire",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(inscriptions.router)
app.include_router(candidatures.router)
app.include_router(blog.router)
app.include_router(settings_router.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "PES API"}
