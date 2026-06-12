import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.poledexcellence.com';
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Accueil (priorité max) ──
    { url: `${BASE_URL}/fr`,             lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/en`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    // ── Pages de conversion (haute priorité) ──
    { url: `${BASE_URL}/fr/inscription`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/en/inscription`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/fr/services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${BASE_URL}/en/services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/fr/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/en/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    // ── Contenu ──
    { url: `${BASE_URL}/fr/blog`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE_URL}/en/blog`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.70 },
    { url: `${BASE_URL}/fr/a-propos`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.60 },
    { url: `${BASE_URL}/en/a-propos`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.50 },
    { url: `${BASE_URL}/fr/carrieres`,   lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/en/carrieres`,   lastModified: now, changeFrequency: 'monthly', priority: 0.60 },
  ];
}
