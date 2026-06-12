'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CtaSection() {
  const t      = useTranslations('cta');
  const locale = useLocale();

  return (
    <section className="relative py-28 overflow-hidden">

      {/* Real brand image as background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-brand.jpg"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden
        />
        {/* Dark overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(14,30,80,0.92) 0%, rgba(30,58,138,0.88) 50%, rgba(14,30,80,0.92) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Label */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(253,230,138,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Rejoignez PES
          </span>

          <h2
            className="font-display font-extrabold leading-tight text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('title')}
          </h2>

          <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(191,219,254,0.80)' }}>
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/inscription`}
              className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full text-base
                         transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0f172a',
                boxShadow: '0 4px 24px rgba(245,158,11,0.45)',
              }}
            >
              {t('button')}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="https://wa.me/237690041633?text=Bonjour%20PES%20!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-full text-base text-white
                         transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: '#25D366',
                boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              {t('whatsapp')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
