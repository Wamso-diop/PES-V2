import type { Metadata } from 'next';
import ContactForm from './_form';

export const metadata: Metadata = {
  title: 'Contact — Bilan pédagogique gratuit à Douala | PES',
  description:
    'Contactez PES pour un bilan pédagogique gratuit et sans engagement. Réponse sous 24h. Soutien scolaire à domicile à Douala — du CP à la Terminale.',
  keywords: [
    'contact soutien scolaire Douala',
    'bilan pédagogique gratuit Douala',
    'cours particuliers inscription Douala',
    'PES contact Douala',
    'soutien scolaire rendez-vous Douala',
  ],
  openGraph: {
    title: 'Contactez PES — Bilan gratuit sans engagement',
    description: 'Réservez votre bilan pédagogique gratuit. Un conseiller vous recontacte sous 24h.',
    type: 'website',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'Contact PES Douala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PES — Bilan pédagogique gratuit',
    description: 'Contactez-nous pour un bilan gratuit à Douala. Réponse sous 24h.',
    images: ['/images/pes-banner.jpg'],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
