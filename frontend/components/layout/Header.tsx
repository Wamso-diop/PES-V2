'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { key: 'home',     href: '/'          },
  { key: 'services', href: '/services'  },
  { key: 'about',    href: '/a-propos'  },
  { key: 'blog',     href: '/blog'      },
  { key: 'careers',  href: '/carrieres' },
  { key: 'contact',  href: '/contact'   },
];

export default function Header() {
  const t        = useTranslations('nav');
  const locale   = useLocale();
  const pathname = usePathname();
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    const full = href === '/' ? `/${locale}` : `/${locale}${href}`;
    return pathname === full;
  };

  const otherLocale   = locale === 'fr' ? 'en' : 'fr';
  const otherPath     = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-slate-100/80'
          : 'bg-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center group">
            <Image
              src="/images/logo-pes.png"
              alt="Pôle d'Excellence Scolaire"
              width={180}
              height={72}
              className="h-[52px] w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={`/${locale}${href === '/' ? '' : href}`}
                prefetch={true}
                className={isActive(href) ? 'nav-link-active' : 'nav-link'}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={otherPath}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              href={`/${locale}/inscription`}
              className="btn-primary text-sm py-2.5 px-5"
            >
              {t('enroll')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(({ key, href }) => (
                <Link
                  key={key}
                  href={`/${locale}${href === '/' ? '' : href}`}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive(href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {t(key)}
                </Link>
              ))}
              <div className="pt-3 pb-1 flex items-center gap-3">
                <Link
                  href={otherPath}
                  className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {otherLocale.toUpperCase()}
                </Link>
                <Link
                  href={`/${locale}/inscription`}
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-sm py-2 px-5 flex-1 justify-center"
                >
                  {t('enroll')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
