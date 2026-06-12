-- Ajouter nom/prenom à la table admins si elle existe déjà
ALTER TABLE admins ADD COLUMN IF NOT EXISTS nom    TEXT DEFAULT '';
ALTER TABLE admins ADD COLUMN IF NOT EXISTS prenom TEXT DEFAULT '';

-- Si la table n'existe pas encore, la créer complète
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom           TEXT NOT NULL DEFAULT '',
  prenom        TEXT NOT NULL DEFAULT '',
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
