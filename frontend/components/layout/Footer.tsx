import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { key: 'home', href: '/' },
    { key: 'services', href: '/services' },
    { key: 'about', href: '/a-propos' },
    { key: 'blog', href: '/blog' },
    { key: 'careers', href: '/carrieres' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-5 group">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Image
                  src="/images/logo-pes.png"
                  alt="Pôle d'Excellence Scolaire"
                  width={180}
                  height={72}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">{t('tagline')}</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all text-white/70">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all text-white/70">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all text-white/70">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm text-white/40 uppercase tracking-wider mb-4">{t('links.title')}</h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${href === '/' ? '' : href}`}
                    className="text-white/70 hover:text-gold-400 text-sm transition-colors"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm text-white/40 uppercase tracking-wider mb-4">{t('contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                {t('contact.address')}
              </li>
              <li>
                <a href={`tel:${t('contact.phone').replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-sm text-white/70 hover:text-gold-400 transition-colors">
                  <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  {t('contact.phone')}
                </a>
              </li>
              <li>
                <a href={`mailto:${t('contact.email')}`} className="flex items-center gap-2.5 text-sm text-white/70 hover:text-gold-400 transition-colors">
                  <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  {t('contact.email')}
                </a>
              </li>
            </ul>
          </div>

          {/* CTA block */}
          <div>
            <h3 className="font-semibold text-sm text-white/40 uppercase tracking-wider mb-4">Bilan gratuit</h3>
            <p className="text-white/60 text-sm mb-4">Obtenez une évaluation pédagogique gratuite sans engagement.</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-gold-gradient text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-gold"
            >
              Réserver
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Pôle d'Excellence Scolaire. {t('rights')}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/legal`} className="text-white/40 hover:text-white/70 text-xs transition-colors">
              {t('links.legal')}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-white/40 hover:text-white/70 text-xs transition-colors">
              {t('links.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
