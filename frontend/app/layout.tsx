import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PES — Pôle d\'Excellence Scolaire',
  description: 'N°1 du soutien scolaire à Douala, Cameroun. 94% de réussite, 500+ familles accompagnées depuis 2010.',
  icons: {
    icon: [
      { url: '/images/logo-pes.png', type: 'image/png' },
    ],
    apple: '/images/logo-pes.png',
    shortcut: '/images/logo-pes.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
