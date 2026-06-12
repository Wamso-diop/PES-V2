import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pôle d\'Excellence Scolaire',
    short_name: 'PES Douala',
    description: 'N°1 du soutien scolaire à Douala. Cours particuliers à domicile.',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    icons: [
      {
        src: '/images/logo-pes.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo-pes.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education'],
    lang: 'fr-CM',
    dir: 'ltr',
  };
}
