-- Ajout colonne niveau_service à la table inscriptions
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS niveau_service TEXT DEFAULT NULL;
