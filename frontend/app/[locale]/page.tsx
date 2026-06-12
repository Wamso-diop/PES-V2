import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import MethodSection from '@/components/home/MethodSection';
import ClassesSection from '@/components/home/ClassesSection';
import SubjectsSection from '@/components/home/SubjectsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import CtaSection from '@/components/home/CtaSection';
import { FaqJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://pes-douala.cm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'PES — N°1 Soutien scolaire à Douala | Cours particuliers Cameroun',
    description:
      'Pôle d\'Excellence Scolaire : N°1 du soutien scolaire à Douala depuis 2010. Cours particuliers à domicile, préparation BEPC & BAC. 94% de réussite. 500+ familles satisfaites.',
    keywords: [
      'soutien scolaire Douala',
      'cours particuliers Douala',
      'répétiteur Douala',
      'cours à domicile Douala',
      'préparation BEPC Douala',
      'préparation BAC Douala',
      'coaching scolaire Cameroun',
      'cours de maths Douala',
      'professeur particulier Douala',
      'PES Douala',
      'Pôle Excellence Scolaire',
      'soutien scolaire Bonanjo',
      'cours particuliers Cameroun',
      'réussite scolaire Douala',
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'fr-CM': `${BASE_URL}/fr`,
        'en-CM': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/fr`,
      },
    },
    openGraph: {
      title: 'PES — N°1 du soutien scolaire à Douala, Cameroun',
      description:
        '94% de réussite. 500+ familles. Cours particuliers à domicile pour tous niveaux du CP à la Terminale à Douala.',
      url: `${BASE_URL}/${locale}`,
      type: 'website',
      images: [
        {
          url: '/images/pes-banner.jpg',
          width: 1200,
          height: 630,
          alt: 'PES — Soutien scolaire N°1 à Douala',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PES — N°1 soutien scolaire Douala',
      description: '94% de réussite. Cours particuliers à domicile à Douala depuis 2010.',
      images: ['/images/pes-banner.jpg'],
    },
  };
}

const FAQ_ITEMS = [
  {
    q: 'Comment fonctionne le soutien scolaire PES à Douala ?',
    a: 'PES envoie un enseignant qualifié au domicile de l\'élève selon un planning hebdomadaire défini ensemble. Chaque session est adaptée aux besoins spécifiques de l\'élève.',
  },
  {
    q: 'Quels niveaux scolaires sont couverts par PES ?',
    a: 'PES accompagne les élèves du CP jusqu\'à la Terminale, incluant la préparation au BEPC et au BAC.',
  },
  {
    q: 'Quel est le taux de réussite de PES ?',
    a: 'PES affiche un taux de réussite de 94% aux examens nationaux (BEPC et BAC) depuis 2010.',
  },
  {
    q: 'Combien coûte le soutien scolaire chez PES ?',
    a: 'PES propose 4 formules adaptées à chaque budget : Élite, Premium, Standard et Sociale. Les tarifs sont communiqués lors du bilan pédagogique gratuit.',
  },
  {
    q: 'Comment contacter PES pour un bilan gratuit ?',
    a: 'Vous pouvez vous inscrire directement en ligne sur notre site ou nous contacter par WhatsApp au +237 690 041 633. Un conseiller vous recontacte sous 24h.',
  },
];

export default function HomePage() {
  return (
    <>
      <WebSiteJsonLd />
      <FaqJsonLd items={FAQ_ITEMS} />
      <HeroSection />
      <StatsSection />
      <MethodSection />
      <ClassesSection />
      <SubjectsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
