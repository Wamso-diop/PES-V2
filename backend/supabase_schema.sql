-- ============================================
-- PES — Schéma PostgreSQL (Supabase)
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: inscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS inscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    nom             TEXT NOT NULL,
    prenom          TEXT NOT NULL,
    email           TEXT NOT NULL,
    telephone       TEXT NOT NULL,
    niveau_eleve    TEXT NOT NULL,
    classe_souhaitee TEXT,
    message         TEXT,
    statut          TEXT NOT NULL DEFAULT 'nouveau'
                    CHECK (statut IN ('nouveau', 'contacté', 'converti', 'archivé')),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inscriptions_updated_at
    BEFORE UPDATE ON inscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TABLE: candidatures
-- ============================================
CREATE TABLE IF NOT EXISTS candidatures (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    nom                 TEXT NOT NULL,
    prenom              TEXT NOT NULL,
    email               TEXT NOT NULL,
    telephone           TEXT NOT NULL,
    poste_vise          TEXT NOT NULL,
    annees_experience   TEXT NOT NULL,
    matieres            TEXT NOT NULL,
    motivation          TEXT NOT NULL,
    cv_url              TEXT,
    niveau_service      TEXT DEFAULT '',
    statut              TEXT NOT NULL DEFAULT 'nouveau'
                        CHECK (statut IN ('nouveau', 'en_etude', 'entretien', 'accepté', 'refusé')),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER candidatures_updated_at
    BEFORE UPDATE ON candidatures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TABLE: articles
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    titre_fr        TEXT NOT NULL,
    titre_en        TEXT,
    slug            TEXT UNIQUE NOT NULL,
    excerpt_fr      TEXT NOT NULL,
    excerpt_en      TEXT,
    contenu_fr      TEXT NOT NULL,
    contenu_en      TEXT,
    cover_image_url TEXT,
    images_urls     TEXT[] DEFAULT '{}',
    youtube_url     TEXT,
    audio_url       TEXT,
    categorie       TEXT NOT NULL,
    auteur          TEXT NOT NULL DEFAULT 'PES',
    statut          TEXT NOT NULL DEFAULT 'brouillon'
                    CHECK (statut IN ('brouillon', 'publié', 'archivé')),
    published_at    TIMESTAMPTZ,
    reading_time    INTEGER DEFAULT 5,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index slug pour lookup rapide
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_statut ON articles(statut);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Inscriptions: insert public, lecture admin uniquement
CREATE POLICY "inscriptions_insert_public" ON inscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "inscriptions_select_admin" ON inscriptions FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "inscriptions_update_admin" ON inscriptions FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "inscriptions_delete_admin" ON inscriptions FOR DELETE USING (auth.role() = 'service_role');

-- Candidatures: insert public, lecture admin uniquement
CREATE POLICY "candidatures_insert_public" ON candidatures FOR INSERT WITH CHECK (true);
CREATE POLICY "candidatures_select_admin" ON candidatures FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "candidatures_update_admin" ON candidatures FOR UPDATE USING (auth.role() = 'service_role');

-- Articles: lecture publique pour statut=publié, CRUD admin
CREATE POLICY "articles_select_public" ON articles FOR SELECT USING (statut = 'publié' OR auth.role() = 'service_role');
CREATE POLICY "articles_insert_admin" ON articles FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "articles_update_admin" ON articles FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "articles_delete_admin" ON articles FOR DELETE USING (auth.role() = 'service_role');
