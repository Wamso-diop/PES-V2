import type { Metadata } from 'next';
import CarrieresForm from './_form';

export const metadata: Metadata = {
  title: 'Devenir Enseignant PES — Postes ouverts à Douala | PES Douala',
  description:
    'Rejoignez l\'équipe PES en tant que professeur particulier à Douala. Postes ouverts en Maths, Physique, Français, Anglais et plus. Rémunération attractive, horaires flexibles.',
  keywords: [
    'emploi professeur Douala',
    'recrutement enseignant Douala',
    'professeur particulier Cameroun',
    'cours à domicile emploi Douala',
    'tuteur emploi Douala',
    'vacataire enseignant Douala',
    'PES recrutement professeur',
  ],
  openGraph: {
    title: 'Rejoindre l\'équipe PES — Enseignants Douala',
    description: 'PES recrute des professeurs passionnés pour accompagner les élèves de Douala. Postulez dès maintenant.',
    type: 'website',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'Recrutement PES Douala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PES recrute des enseignants à Douala',
    description: 'Rejoignez notre équipe de professeurs passionnés. Postulez en ligne.',
    images: ['/images/pes-banner.jpg'],
  },
};

export default function CarrieresPage() {
  return <CarrieresForm />;
}
