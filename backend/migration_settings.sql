-- ============================================
-- Migration: Ajout colonnes admins + table site_settings
-- À exécuter dans Supabase → SQL Editor
-- ============================================

-- 1. Ajouter nom et prenom à la table admins
ALTER TABLE admins ADD COLUMN IF NOT EXISTS nom    TEXT DEFAULT '';
ALTER TABLE admins ADD COLUMN IF NOT EXISTS prenom TEXT DEFAULT '';

-- 2. Créer la table site_settings (une seule ligne, id = 1)
CREATE TABLE IF NOT EXISTS site_settings (
    id                 INTEGER PRIMARY KEY DEFAULT 1,
    site_name          TEXT DEFAULT 'Pôle d''Excellence Scolaire',
    contact_email      TEXT DEFAULT 'contact@pes-douala.cm',
    whatsapp           TEXT DEFAULT '+237 6XX XXX XXX',
    inscription_goal   INTEGER DEFAULT 200,
    meta_title         TEXT DEFAULT 'PES — Pôle d''Excellence Scolaire Douala',
    meta_description   TEXT DEFAULT 'Soutien scolaire à Douala. Cours à domicile, coaching pédagogique.',
    site_url           TEXT DEFAULT 'https://pes-douala.cm',
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insérer la ligne par défaut (ne rien faire si elle existe déjà)
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 4. RLS pour site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_select_public" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_update_admin"  ON site_settings FOR UPDATE USING (auth.role() = 'service_role');

-- 5. Trigger updated_at sur site_settings
CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
