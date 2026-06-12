'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
