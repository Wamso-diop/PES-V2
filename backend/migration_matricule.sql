-- ============================================================
-- Migration : Ajout matricules automatiques
-- PESF260001 = PES + F(famille) + 26(année) + 00001(ordre)
-- PESE260001 = PES + E(enseignant) + 26(année) + 00001(ordre)
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- 1. Ajouter les colonnes matricule
ALTER TABLE inscriptions  ADD COLUMN IF NOT EXISTS matricule TEXT UNIQUE;
ALTER TABLE candidatures  ADD COLUMN IF NOT EXISTS matricule TEXT UNIQUE;

-- 2. Attribuer rétroactivement aux inscriptions existantes (parents)
WITH ranked AS (
    SELECT
        id,
        'PESF' || TO_CHAR(created_at, 'YY') ||
        LPAD(
            ROW_NUMBER() OVER (
                PARTITION BY TO_CHAR(created_at, 'YY')
                ORDER BY created_at ASC
            )::TEXT,
        5, '0') AS new_matricule
    FROM inscriptions
    WHERE matricule IS NULL
)
UPDATE inscriptions
SET matricule = ranked.new_matricule
FROM ranked
WHERE inscriptions.id = ranked.id;

-- 3. Attribuer rétroactivement aux candidatures existantes (enseignants)
WITH ranked AS (
    SELECT
        id,
        'PESE' || TO_CHAR(created_at, 'YY') ||
        LPAD(
            ROW_NUMBER() OVER (
                PARTITION BY TO_CHAR(created_at, 'YY')
                ORDER BY created_at ASC
            )::TEXT,
        5, '0') AS new_matricule
    FROM candidatures
    WHERE matricule IS NULL
)
UPDATE candidatures
SET matricule = ranked.new_matricule
FROM ranked
WHERE candidatures.id = ranked.id;
