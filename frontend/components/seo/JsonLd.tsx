const BASE_URL = 'https://www.poledexcellence.com';

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Pôle d\'Excellence Scolaire',
    alternateName: ['PES Douala', 'PES'],
    description: 'N°1 du soutien scolaire à Douala, Cameroun. Cours particuliers à domicile, préparation BEPC et BAC depuis 2010. 94% de taux de réussite.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo-pes.png`,
      width: 180,
      height: 72,
    },
    image: `${BASE_URL}/images/pes-banner.jpg`,
    telephone: '+237690041633',
    email: 'contact@pes-douala.cm',
    foundingDate: '2010',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 30 },
    founder: {
      '@type': 'Person',
      name: 'Alain FUMTUM',
      jobTitle: 'Fondateur & Directeur pédagogique',
      alumniOf: 'UCAC-ICAM',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bonanjo',
      addressLocality: 'Douala',
      addressRegion: 'Littoral',
      addressCountry: 'CM',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 4.0482,
      longitude: 9.7043,
    },
    areaServed: {
      '@type': 'City',
      name: 'Douala',
      containedInPlace: { '@type': 'Country', name: 'Cameroun' },
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formules de soutien scolaire PES',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Service Élite',
          description: 'Accompagnement intensif 3 à 4 cours/semaine avec enseignants des meilleures écoles de Douala.',
          category: 'Soutien scolaire premium',
        },
        {
          '@type': 'Offer',
          name: 'Service Premium',
          description: 'Suivi rigoureux 2 à 3 cours/semaine avec enseignants expérimentés.',
          category: 'Soutien scolaire',
        },
        {
          '@type': 'Offer',
          name: 'Service Standard',
          description: 'Accompagnement régulier 1 à 2 cours/semaine, idéal pour consolider les acquis.',
          category: 'Soutien scolaire',
        },
        {
          '@type': 'Offer',
          name: 'Service Sociale',
          description: 'Formule accessible pour démocratiser l\'excellence scolaire à Douala.',
          category: 'Soutien scolaire accessible',
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/share/1DCSYahXTs/',
      'https://www.instagram.com/p/DYt-ENkODMz/?igsh=MWJmOXVsd2ppamJwYw==',
      'https://whatsapp.com/channel/0029VbDBahH9RZAgJgNakh06',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Pôle d\'Excellence Scolaire',
      url: BASE_URL,
      description: 'N°1 du soutien scolaire à Douala. Cours particuliers, préparation BEPC et BAC.',
      inLanguage: ['fr-CM', 'en-CM'],
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/fr/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      name: ['Nos services', 'Inscription', 'Blog', 'À propos', 'Contact', 'Carrières'],
      url: [
        `${BASE_URL}/fr/services`,
        `${BASE_URL}/fr/inscription`,
        `${BASE_URL}/fr/blog`,
        `${BASE_URL}/fr/a-propos`,
        `${BASE_URL}/fr/contact`,
        `${BASE_URL}/fr/carrieres`,
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title, description, datePublished, dateModified, image, author, url,
}: {
  title: string; description: string; datePublished: string;
  dateModified?: string; image?: string; author?: string; url: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ?? `${BASE_URL}/images/pes-banner.jpg`,
    author: {
      '@type': 'Person',
      name: author ?? 'Équipe PES',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pôle d\'Excellence Scolaire',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo-pes.png` },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
