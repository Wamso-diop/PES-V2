import type { Metadata } from 'next';
import BlogClient from './_client';

export const metadata: Metadata = {
  title: 'Blog — Conseils scolaires, astuces BEPC et BAC | PES Douala',
  description:
    'Articles pédagogiques, conseils de révision, actualités BEPC et BAC rédigés par les experts PES. Accompagnez votre enfant vers la réussite scolaire à Douala.',
  keywords: [
    'blog soutien scolaire Douala',
    'conseils révision BEPC Cameroun',
    'astuces bac Douala',
    'cours particuliers blog',
    'réussir examens Cameroun',
    'conseils parents élèves Douala',
  ],
  openGraph: {
    title: 'Blog PES — Ressources pédagogiques pour réussir',
    description: 'Articles, astuces et conseils pour élèves et parents du collège et lycée à Douala, Cameroun.',
    type: 'website',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'Blog PES Douala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog PES — Ressources pédagogiques',
    description: 'Articles et conseils scolaires pour réussir au Cameroun.',
    images: ['/images/pes-banner.jpg'],
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
