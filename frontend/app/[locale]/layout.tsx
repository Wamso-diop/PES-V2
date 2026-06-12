import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import ConditionalShell from '@/components/layout/ConditionalShell';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const BASE_URL = 'https://pes-douala.cm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'PES — N°1 du soutien scolaire à Douala, Cameroun',
      template: '%s | PES Douala',
    },
    description: t('subtitle'),
    keywords: [
      'soutien scolaire Douala',
      'cours particuliers Douala',
      'répétiteur Douala',
      'cours à domicile Douala',
      'préparation BEPC Douala',
      'préparation BAC Douala',
      'coaching scolaire Cameroun',
      'PES Douala',
      'Pôle Excellence Scolaire',
      'cours de maths Douala',
    ],
    authors: [{ name: 'Pôle d\'Excellence Scolaire', url: BASE_URL }],
    creator: 'PES Douala',
    publisher: 'Pôle d\'Excellence Scolaire',
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'fr-CM': `${BASE_URL}/fr`,
        'en-CM': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/fr`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Pôle d\'Excellence Scolaire',
      locale: locale === 'fr' ? 'fr_CM' : 'en_CM',
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: '/images/pes-banner.jpg',
          width: 1200,
          height: 630,
          alt: 'Pôle d\'Excellence Scolaire — Soutien scolaire à Douala',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@PESDouala',
      creator: '@PESDouala',
      images: ['/images/pes-banner.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/images/logo-pes.png', type: 'image/png' },
      ],
      apple: '/images/logo-pes.png',
    },
    verification: {
      google: 'GOOGLE_SEARCH_CONSOLE_KEY',
    },
    category: 'education',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as 'fr' | 'en')) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-white text-navy-950`}>
        <LocalBusinessJsonLd />
        <NextIntlClientProvider messages={messages}>
          <ConditionalShell>{children}</ConditionalShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
