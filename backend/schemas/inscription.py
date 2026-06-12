from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class StatutInscription(str, Enum):
    nouveau = "nouveau"
    contacte = "contacté"
    converti = "converti"
    archive = "archivé"


class InscriptionCreate(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    telephone: str
    niveau_eleve: str
    classe_souhaitee: Optional[str] = None
    message: Optional[str] = None
    niveau_service: Optional[str] = None


class InscriptionUpdate(BaseModel):
    statut: Optional[StatutInscription] = None


class InscriptionOut(BaseModel):
    id: str
    nom: str
    prenom: str
    email: str
    telephone: str
    niveau_eleve: str
    classe_souhaitee: Optional[str]
    message: Optional[str]
    niveau_service: Optional[str]
    statut: StatutInscription
    created_at: datetime
