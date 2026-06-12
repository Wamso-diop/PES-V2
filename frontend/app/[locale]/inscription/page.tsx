import type { Metadata } from 'next';
import InscriptionSteps from './_steps';

export const metadata: Metadata = {
  title: 'Inscription — Choisir une formule de soutien scolaire | PES Douala',
  description:
    'Inscrivez votre enfant au soutien scolaire PES à Douala. Choisissez parmi 4 formules : Élite, Premium, Standard et Sociale. Du CP à la Terminale. Démarrage en 48h.',
  keywords: [
    'inscription soutien scolaire Douala',
    'cours particuliers inscription Douala',
    'inscrire enfant cours Douala',
    'formule soutien scolaire Cameroun',
    'PES inscription Douala',
    'cours à domicile inscription Cameroun',
    'soutien scolaire Douala tarif',
  ],
  openGraph: {
    title: 'S\'inscrire chez PES — Soutien scolaire à Douala',
    description: 'Choisissez votre formule (Élite, Premium, Standard ou Sociale) et inscrivez votre enfant en 2 minutes. Démarrage en 48h.',
    type: 'website',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'Inscription PES Douala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PES — Inscription soutien scolaire Douala',
    description: '4 formules de soutien scolaire à Douala. Inscrivez-vous en ligne.',
    images: ['/images/pes-banner.jpg'],
  },
};

export default function InscriptionPage() {
  return <InscriptionSteps />;
}
