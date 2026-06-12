# PES — Pôle d'Excellence Scolaire
## Cahier des Charges Technique — Version FINALE
**Date** : Mai 2026 | **Destination** : Claude Code | **Priorité absolue** : SEO + Design Premium

---

## 1. Vision du projet

**PES (Pôle d'Excellence Scolaire)** est la référence du soutien scolaire à domicile à Douala, Cameroun.
Fondé en 2010 par Alain FUMTUM, ingénieur UCAC-ICAM, PES accompagne les familles depuis plus de 16 ans.

### Objectif principal du site
**Dominer le SEO sur les requêtes :**
- "cours de répétition à domicile Douala"
- "soutien scolaire Cameroun"
- "cours particuliers Douala"
- "répétiteur à domicile Cameroun"
- "cours de maths physique chimie Douala"
- "préparation BEPC BAC Douala"
- "coaching scolaire Douala"
- Et toutes les variantes enseignement général + technique

### Positionnement
Site vitrine **premium**, propre, sobre, institutionnel.
Version upgradée et perfectionnée du site MAS existant.
Adapté parfaitement à tous les appareils (mobile-first).

---

## 2. Stack technique

| Élément | Choix |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Backend | FastAPI (Python) |
| Base de données | PostgreSQL (Supabase) |
| Stockage | Supabase Storage (CV, images blog) |
| Auth admin | JWT + bcrypt |
| Emails | Resend |
| Analytics | Plausible Analytics |
| Déploiement frontend | Vercel |
| Déploiement backend | Railway |
| Internationalisation | next-intl (FR / EN) |
| Animations | Framer Motion |
| Formulaires | React Hook Form + Zod |

---

## 3. SEO — Stratégie complète

### 3.1 SEO Technique
- **Server-Side Rendering (SSR)** sur toutes les pages publiques via Next.js App Router
- `generateMetadata()` dynamique sur chaque page avec titre, description, keywords, OG, Twitter Card
- **Schema.org JSON-LD** sur chaque page :
  - `LocalBusiness` sur la page d'accueil (nom, adresse, ville Douala, téléphone, horaires)
  - `EducationalOrganization` (nom PES, description, domaines enseignés)
  - `Person` pour Alain FUMTUM (fondateur)
  - `FAQPage` sur les pages services
  - `BreadcrumbList` sur toutes les pages internes
  - `Article` sur chaque article de blog
- **Sitemap XML dynamique** : `/sitemap.xml` généré automatiquement (pages + articles)
- **robots.txt** correctement configuré
- **Canonical URLs** sur toutes les pages
- **Hreflang** FR/EN sur toutes les pages bilingues
- **Core Web Vitals optimisés** : LCP < 2.5s, FID < 100ms, CLS < 0.1
- `next/image` avec lazy loading, formats WebP/AVIF automatiques
- Polices via `next/font` (pas de requêtes externes bloquantes)
- Pas de JavaScript bloquant le rendu initial

### 3.2 SEO On-Page (par page)
Chaque page a :
- Un H1 unique contenant les mots-clés cibles
- Une hiérarchie H1 → H2 → H3 stricte et logique
- Des paragraphes riches en mots-clés naturels
- Des images avec attributs `alt` descriptifs et optimisés
- Des liens internes stratégiques entre les pages
- Des méta-descriptions uniques de 150-160 caractères

### 3.3 Mots-clés cibles par page

| Page | Mots-clés principaux |
|---|---|
| Accueil | cours de répétition Douala, soutien scolaire Cameroun, PES Pôle Excellence Scolaire |
| Services | cours particuliers à domicile Douala, répétiteur Douala, coaching scolaire collège lycée |
| Services | cours maths physique chimie Douala, toutes matières général technique |
| Blog | conseils révision BEPC, préparer BAC Cameroun, méthodes travail élèves |
| Carrières | enseignant répétiteur Douala, prof particulier Cameroun |
| Contact | cours de soutien Douala, PES contact Douala |
| À propos | Alain FUMTUM, PES histoire, soutien scolaire Douala depuis 2010 |

### 3.4 SEO Local (Google Maps)
- Balise `LocalBusiness` avec adresse exacte Douala
- Numéro de téléphone et WhatsApp dans les données structurées
- Mention de Douala, Cameroun dans H1 ou H2 de la page d'accueil
- Page de contact avec Google Maps embed

### 3.5 Performance SEO Blog
- URLs propres : `/blog/conseils-preparation-bepc-douala`
- Slugs riches en mots-clés
- Table des matières automatique sur les longs articles
- Temps de lecture affiché
- Partage WhatsApp et Facebook sur chaque article
- Articles bilingues (FR + EN) pour capter le trafic anglophone camerounais

---

## 4. Design — Principes premium

### 4.1 Philosophie design
- **Propre, sobre, institutionnel** — pas de surcharge visuelle
- **Typographie soignée** — hiérarchie claire, lisibilité parfaite
- **Espacement généreux** — respiration des éléments
- **Cohérence absolue** — même système de couleurs, tailles, arrondis partout
- **Animations subtiles** — entrées au scroll légères, jamais distrayantes
- **Qualité photographique** — pas d'images génériques, photos authentiques

### 4.2 Charte graphique
- Conserver les couleurs, typographie et tokens du projet MAS existant
- Seul le logo change : MAS → PES (nouveau SVG sobre et institutionnel)
- Mode clair ET mode sombre parfaitement fonctionnels sur toutes les pages

### 4.3 Responsive — Mobile First
- Priorité absolue smartphone (majorité des utilisateurs au Cameroun)
- Points de rupture : 375px / 640px / 768px / 1024px / 1280px
- Navigation mobile : hamburger menu + bottom bar
- Touch targets minimum 44×44px
- Pas de scroll horizontal sur aucun écran
- Formulaires optimisés clavier mobile (types input adaptés)
- Images et vidéos fluides sur tous les formats

---

## 5. Navigation

### Header fixe
```
[Logo PES]   Accueil | Services | Blog | Carrières | Contact   [FR/EN]  [Contacter sur WhatsApp]
```
- Header blanc fixe avec légère ombre au scroll
- Bouton CTA **"Contacter sur WhatsApp"** — vert WhatsApp, visible et clair
- Sélecteur langue FR/EN
- Sur mobile : burger menu

### Bouton WhatsApp flottant (toutes les pages)
- Bouton fixe en bas à droite
- Label visible : **"Contacter sur WhatsApp"**
- Couleur verte WhatsApp (#25D366)
- Lien direct `https://wa.me/[numéro]`
- Légère animation au chargement pour attirer l'attention

### Footer
- Logo PES + slogan "L'excellence scolaire pour tous"
- Navigation : Accueil, Services, Blog, Carrières, Contact, À propos
- Réseaux sociaux : Facebook, Instagram, WhatsApp
- Adresse + téléphone + email
- Copyright PES © 2026
- Mentions légales

---

## 6. Pages publiques

### 6.1 Page `/` — Accueil

**H1 cible** : "Cours de répétition à domicile à Douala — PES, Pôle d'Excellence Scolaire"

**Sections :**
1. **Hero** : accroche forte + slogan "L'excellence scolaire pour tous" + bouton "Contacter sur WhatsApp" + bouton "Découvrir nos services"
2. **Statistiques animées** : 16+ ans d'expérience, 500+ élèves accompagnés, 94% de réussite, 25+ enseignants qualifiés
3. **Nos 4 classes** : Élite / Premium / Standard / Sociale — cartes visuelles avec badge prix
4. **Matières enseignées** : toutes les matières général + technique avec icônes
5. **Notre méthode** : 4 étapes (Évaluation → Programme → Suivi → Résultats)
6. **Témoignages parents** : slider avec avatars et citations
7. **Pourquoi PES** : 6 avantages (16 ans d'expérience, enseignants triés sur le volet, suivi personnalisé, etc.)
8. **CTA final** : "Demander un bilan pédagogique gratuit" + bouton WhatsApp
9. **FAQ** (SEO) : 5-6 questions fréquentes avec réponses (balisage FAQ schema.org)

---

### 6.2 Page `/services` — Services & Programmes

**H1 cible** : "Cours particuliers à domicile à Douala — Toutes matières, Collège et Lycée"

**Sections :**
1. Intro : "Enseignement général et technique, de la 6e à la Terminale"
2. **Les 4 classes PES** :

#### Classe Élite (> 100 000 FCFA/mois)
- Enseignants des collèges de renom (Collège Libermann, De La Salle ou profil équivalent)
- 5 ans+ d'expérience
- Assistance personnalisée à domicile 3-4x/semaine
- Coaching scolaire individuel avec conseiller pédagogique
- Accès ressources haute qualité (livres, logiciels)
- Suivi régulier des progrès
- Activités extrascolaires (sport, musique)
- Participation concours nationaux et internationaux
- Espace de travail personnel avec équipements de pointe

#### Classe Premium (75 000 – 100 000 FCFA/mois)
- Enseignants des grands collèges (Collège Laval, Collège Duval ou équivalent)
- 3 à 5 ans d'expérience
- Assistance personnalisée à domicile 3-4x/semaine
- Coaching scolaire en groupe (5 élèves max)
- Accès ressources pédagogiques de qualité
- Suivi régulier des progrès
- Activités extrascolaires
- Participation concours régionaux

#### Classe Standard (25 000 – 75 000 FCFA/mois)
- Enseignants qualifiés (1 à 3 ans d'expérience)
- Assistance à domicile 2-3x/semaine
- Coaching scolaire en groupe (10 élèves max)
- Accès ressources pédagogiques de base
- Suivi régulier des progrès

#### Classe Sociale (< 25 000 FCFA/mois)
- Cours en groupe dans un centre (10 à 20 élèves)
- Enseignants qualifiés (1 à 2 ans d'expérience)
- Accès ressources pédagogiques de base
- Suivi régulier des progrès
- Activités extrascolaires à tarifs réduits

3. **Matières — Enseignement Général** :
   Mathématiques, Physique-Chimie, SVT, Français, Anglais, Histoire-Géographie, Philosophie, Économie

4. **Matières — Enseignement Technique** :
   Mathématiques Techniques, Sciences Physiques, Technologie, Génie Civil, Génie Électrique, Génie Mécanique, Informatique, Comptabilité

5. **Examens préparés** : BEPC, Probatoire, BAC A, BAC C, BAC D, BAC TI, Concours Grandes Écoles

6. **FAQ Services** (schema.org FAQPage) : questions sur le fonctionnement, tarifs, engagement

7. **CTA** : "Choisir ma classe" → formulaire contact

---

### 6.3 Page `/blog` — Blog

**H1 cible** : "Conseils scolaires, méthodes de révision et actualités éducatives au Cameroun"

- Article vedette (grand format)
- Grille articles : image de couverture, catégorie colorée, titre, résumé, temps de lecture, date
- Filtres : Conseils / Examens / Actualités / Motivation
- Bloc newsletter
- Bilingue FR / EN

#### `/blog/[slug]` — Article
- Contenu complet (texte + images multiples)
- Table des matières auto (pour les longs articles)
- Auteur + date + temps de lecture
- Schema.org Article
- Partage : WhatsApp, Facebook
- Articles suggérés

---

### 6.4 Page `/carrieres` — Carrières

**H1 cible** : "Devenir enseignant répétiteur à Douala — Rejoignez l'équipe PES"

**Sections :**
1. **Intro** : culture PES, valeurs, environnement de travail
2. **Les 4 profils recherchés** :

#### Enseignant Service Élite
- 5 ans+ d'expérience | Établissements de renom (Libermann, De La Salle…)
- Qualités : rigueur, discipline, créativité, capacité à motiver et stimuler
- Compétences : adaptation méthodes aux besoins individuels, gestion de classe efficace
- Responsabilités : suivi personnalisé, cours haute qualité, réunions parents, activités extrascolaires
- Avantages : rémunération attractive, environnement stimulant, développement professionnel

#### Enseignant Service Premium
- 3 à 5 ans d'expérience | Établissements de référence (Lycée Joss, Lycée de Makepe…)
- Qualités : rigueur, communication efficace, travail en équipe
- Compétences : enseignement interactif, évaluation des progrès
- Responsabilités : suivi personnalisé, cours de qualité, réunions parents
- Avantages : rémunération attractive, développement professionnel

#### Enseignant Service Standard
- 1 à 3 ans d'expérience | Bonne connaissance programmes scolaires
- Qualités : rigueur, discipline, communication efficace
- Compétences : enseignement interactif, évaluation des progrès
- Responsabilités : suivi élèves, préparation cours, réunions parents
- Avantages : rémunération attractive, environnement stimulant

#### Enseignant Service Social
- Motivé, bonne connaissance des programmes
- Cours en groupe dans des centres de formation
- Qualités : rigueur, discipline, communication
- Responsabilités : suivi élèves en groupe, préparation cours, réunions parents
- Avantages : rémunération attractive, développement professionnel

3. **Formulaire de candidature** :
   - Nom, prénom, email, téléphone
   - Poste visé (Élite / Premium / Standard / Social)
   - Établissements où il a enseigné
   - Années d'expérience
   - Matières enseignées
   - Message de motivation
   - Upload CV (PDF, max 5 Mo)
   - Soumission → stockage Supabase + notification admin email

---

### 6.5 Page `/contact` — Contact

**H1 cible** : "Contactez PES — Cours de soutien scolaire à Douala"

- Formulaire : nom, prénom, email, téléphone, niveau de l'élève, classe souhaitée, message
- Bouton **"Contacter sur WhatsApp"** (vert, bien visible)
- Informations : adresse Douala, horaires, téléphone, email
- Google Maps embed
- Schema.org LocalBusiness complet

---

### 6.6 Page `/a-propos` — À propos

**H1 cible** : "PES Douala — 16 ans d'excellence scolaire au Cameroun"

**Histoire complète :**
Depuis plus de 16 ans, PES (Pôle d'Excellence Scolaire) offre son expertise aux familles pour une éducation de haute qualité dans la ville de Douala, au Cameroun. Mais l'histoire de PES commence bien avant sa création officielle en 2010.

Son fondateur, **Alain FUMTUM**, est un ingénieur UCAC-ICAM de la quatrième promotion, passionné par l'enseignement. Né de parents enseignants, il a été marqué dès son enfance par l'importance de transmettre le savoir. Dès le secondaire, il commence à donner des cours de soutien à des élèves plus jeunes, notamment en mathématiques, physique et chimie.

Au fil des ans, cette passion pour l'enseignement ne fait que grandir. À l'école d'ingénieur, il continue à donner des cours particuliers, puis commence à suivre des élèves individuellement. C'est ainsi qu'il découvre sa vocation : aider les élèves à atteindre leur plein potentiel.

Diplômé en 2010, Alain décide de ne pas suivre la voie traditionnelle de l'entreprise, malgré les opportunités et les rémunérations attractives. Il choisit de lancer une maison d'assistance scolaire pour recruter d'autres jeunes passionnés et leur offrir la possibilité de transmettre leur savoir.

Ainsi naît PES, avec pour mission d'aider les élèves à déployer leurs ailes et à atteindre l'excellence. Depuis, l'équipe de PES n'a cessé de grandir et de se développer, offrant des services de qualité aux familles de Douala et au-delà.

Aujourd'hui, **Alain FUMTUM**, directeur pédagogique et coordonnateur de PES, est fier de voir son rêve se réaliser. Il est convaincu que l'éducation est la clé du succès et que chaque élève a le potentiel de réussir.

**Sections :**
1. Mission et slogan
2. Histoire (texte complet ci-dessus)
3. Timeline : 2010 → 2014 → 2018 → 2021 → 2026
4. Valeurs : Excellence · Bienveillance · Rigueur · Proximité
5. Le fondateur : Alain FUMTUM (photo + bio)
6. Équipe enseignante (photos + spécialités)
7. Schema.org : Person (Alain FUMTUM) + EducationalOrganization

---

## 7. Espace Admin (Backend privé)

### 7.1 Accès
- URL : `/admin/login`
- Authentification JWT, expiration 24h
- Accès uniquement pour le responsable PES

---

### 7.2 Dashboard `/admin`

**Métriques en temps réel :**
- Visiteurs uniques (aujourd'hui / 7j / 30j)
- Pages les plus visitées
- Sources de trafic (Google organique, WhatsApp, Facebook, direct)
- Pays et villes des visiteurs
- Taux de rebond
- Nouvelles inscriptions parents reçues (aujourd'hui / total)
- Nouvelles candidatures enseignants (aujourd'hui / total)

**Widgets rapides :**
- 5 dernières inscriptions parents
- 5 dernières candidatures enseignants
- 3 derniers articles publiés

---

### 7.3 Inscriptions parents `/admin/inscriptions`

Tableau complet avec colonnes :
Date | Nom | Téléphone | Email | Niveau élève | Classe souhaitée | Message | Statut | Actions

**Actions disponibles :**
- **"Contacter sur WhatsApp"** : ouvre WhatsApp Web avec numéro pré-rempli + message type automatique
- Changer le statut : Nouveau → Contacté → En cours → Clôturé
- Voir le détail complet
- Filtres : statut, classe souhaitée, date
- Export CSV

---

### 7.4 Candidatures enseignants `/admin/candidatures`

Tableau complet avec colonnes :
Date | Nom | Téléphone | Email | Poste visé | Expérience | Établissements | CV | Statut | Actions

**Actions disponibles :**
- **"Contacter sur WhatsApp"** : ouvre WhatsApp Web avec numéro pré-rempli
- Télécharger le CV (PDF depuis Supabase Storage)
- Changer le statut : Nouveau → En étude → Retenu → Refusé
- Filtres : poste, statut, date
- Export CSV

---

### 7.5 Blog `/admin/blog`

**Liste des articles :**
Titre | Catégorie | Langue | Date | Statut (Publié/Brouillon) | Actions (Modifier/Supprimer)

**Créer / modifier un article :**
- Titre (FR et EN)
- Slug auto-généré (éditable)
- Image de couverture (upload)
- Images supplémentaires (upload multiple)
- Catégorie : Conseils / Examens / Actualités / Motivation
- Auteur
- Résumé court (excerpt)
- Contenu riche : éditeur WYSIWYG (texte, titres H2/H3, listes, images inline, liens)
- Langue : FR / EN
- Statut : Brouillon / Publié
- Date de publication (programmable)
- Temps de lecture (calculé automatiquement)

---

### 7.6 Analytics `/admin/analytics`

- Intégration Plausible Analytics
- Vue complète : visiteurs, pages vues, durée session, taux de rebond
- Top pages visitées
- Sources de trafic
- Appareils (mobile / desktop / tablet)
- Géolocalisation (villes camerounaises)
- Évolution 7j / 30j / 90j

---

## 8. API FastAPI — Endpoints

```
# Auth
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# Inscriptions
POST   /api/inscriptions              # Public
GET    /api/admin/inscriptions        # Admin — liste
GET    /api/admin/inscriptions/{id}   # Admin — détail
PATCH  /api/admin/inscriptions/{id}   # Admin — modifier statut
DELETE /api/admin/inscriptions/{id}   # Admin

# Candidatures
POST   /api/candidatures              # Public (multipart — CV upload)
GET    /api/admin/candidatures        # Admin — liste
GET    /api/admin/candidatures/{id}   # Admin — détail
PATCH  /api/admin/candidatures/{id}   # Admin — modifier statut
DELETE /api/admin/candidatures/{id}   # Admin

# Blog
GET    /api/blog/articles             # Public — liste publiés
GET    /api/blog/articles/{slug}      # Public — article individuel
GET    /api/admin/blog/articles       # Admin — tous articles
POST   /api/admin/blog/articles       # Admin — créer
PATCH  /api/admin/blog/articles/{id}  # Admin — modifier
DELETE /api/admin/blog/articles/{id}  # Admin — supprimer
POST   /api/admin/blog/upload         # Admin — upload image

# Analytics
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/pages
GET    /api/admin/analytics/sources
```

---

## 9. Modèles de données PostgreSQL

```sql
CREATE TABLE inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(200),
  telephone VARCHAR(20) NOT NULL,
  niveau_eleve VARCHAR(50),
  classe_souhaitee VARCHAR(20),  -- elite|premium|standard|sociale
  message TEXT,
  statut VARCHAR(20) DEFAULT 'nouveau',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  poste_vise VARCHAR(20) NOT NULL,
  annees_experience INTEGER,
  etablissements TEXT,
  matieres TEXT,
  motivation TEXT,
  cv_url TEXT,
  statut VARCHAR(20) DEFAULT 'nouveau',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  titre_fr VARCHAR(300),
  titre_en VARCHAR(300),
  slug VARCHAR(300) UNIQUE NOT NULL,
  excerpt_fr TEXT,
  excerpt_en TEXT,
  contenu_fr TEXT,
  contenu_en TEXT,
  cover_image_url TEXT,
  images_urls TEXT[],
  categorie VARCHAR(50),
  auteur VARCHAR(100),
  statut VARCHAR(20) DEFAULT 'brouillon',
  published_at TIMESTAMP,
  reading_time INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. Structure des fichiers

```
pes/
├── frontend/                          # Next.js
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx               # Accueil (SSR + SEO)
│   │   │   ├── services/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── carrieres/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── a-propos/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx               # Dashboard
│   │   │   ├── inscriptions/page.tsx
│   │   │   ├── candidatures/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nouveau/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── sitemap.ts                 # Sitemap dynamique
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppButton.tsx     # Bouton flottant "Contacter sur WhatsApp"
│   │   ├── seo/
│   │   │   ├── JsonLd.tsx             # Schema.org JSON-LD
│   │   │   └── BreadcrumbJsonLd.tsx
│   │   ├── home/
│   │   ├── services/
│   │   ├── blog/
│   │   ├── carrieres/
│   │   ├── admin/
│   │   └── ui/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── seo.ts                     # Helpers generateMetadata
│   │   └── utils.ts
│   ├── messages/
│   │   ├── fr.json
│   │   └── en.json
│   └── public/
│       ├── logo-pes.svg
│       └── logo-pes-white.svg
│
└── backend/                           # FastAPI
    ├── main.py
    ├── routers/
    │   ├── auth.py
    │   ├── inscriptions.py
    │   ├── candidatures.py
    │   ├── blog.py
    │   └── analytics.py
    ├── models/
    ├── database.py
    ├── auth.py
    └── requirements.txt
```

---

## 11. Phases de développement

### Phase 1 — Fondations
1. Init Next.js 14 + TypeScript + Tailwind
2. Init FastAPI + PostgreSQL (Supabase)
3. Nouveau logo PES (SVG sobre et institutionnel)
4. Header + Footer + Bouton WhatsApp flottant
5. Configuration next-intl (FR/EN)
6. Composants UI de base (Button, Badge, Card, Input)

### Phase 2 — Pages publiques
7. Page Accueil (SSR + SEO complet + Schema.org)
8. Page Services (4 classes + matières général/technique)
9. Page Carrières + formulaire candidature
10. Page Contact + formulaire inscription
11. Page À propos (histoire Alain FUMTUM + timeline)

### Phase 3 — Blog
12. Page Blog liste
13. Page Article individuel
14. Schema.org Article + sitemap dynamique

### Phase 4 — Admin
15. Auth JWT
16. Dashboard métriques
17. Gestion inscriptions parents + WhatsApp direct
18. Gestion candidatures + téléchargement CV
19. Gestion blog (CRUD + éditeur WYSIWYG + upload images)
20. Analytics Plausible

### Phase 5 — SEO & Finalisation
21. Audit SEO complet (Lighthouse > 95)
22. Schema.org sur toutes les pages
23. Sitemap XML + robots.txt
24. Optimisation images et performances
25. Tests responsive sur tous les appareils
26. Déploiement Vercel + Railway

---

## 12. Commandes de démarrage

```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
cd frontend
npm install next-intl framer-motion react-hook-form zod

# Backend
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose bcrypt python-multipart resend
```

---

*PES · Pôle d'Excellence Scolaire · Douala, Cameroun · Mai 2026*
*"L'excellence scolaire pour tous"*
