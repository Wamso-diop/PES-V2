'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, Star, TrendingUp, Award } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.11, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const AVATAR_COLORS = ['#1e40af', '#7c3aed', '#2563eb', '#be185d'] as const;
const AVATAR_INITIALS = ['A', 'M', 'S', 'P'] as const;

export default function HeroSection() {
  const t      = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-[72px]">

      {/* Tinted gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-slate-50/60 pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom right, black 20%, transparent 75%)',
          WebkitMaskImage: 'linear-gradient(to bottom right, black 20%, transparent 75%)',
          opacity: 0.45,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16
                      grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center w-full">

        {/* ─── LEFT: Copy ─── */}
        <div className="max-w-lg lg:max-w-none">

          {/* Top badge */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
          >
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-[13px] font-bold px-4 py-1.5 rounded-full mb-8">
              <Award className="w-3.5 h-3.5" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display font-extrabold leading-[1.07] tracking-tight text-slate-900"
            style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.6rem)' }}
          >
            {t('title')}
            <br />
            <span
              style={{
                background: 'linear-gradient(95deg, #1d4ed8 0%, #6d28d9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('titleAccent')}
            </span>
          </motion.h1>

          {/* Left-bordered tagline */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-7 pl-4 border-l-[3px] border-amber-400"
          >
            <p className="text-slate-500 italic text-[1rem] leading-relaxed">
              «&nbsp;{t('tagline')}&nbsp;»
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-5 text-slate-500 text-lg leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* Trust badges row */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5"
          >
            {[t('trustBadge1'), t('trustBadge2'), t('trustBadge3')].map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href={`/${locale}/inscription`}
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-base text-white
                         transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                boxShadow: '0 4px 22px rgba(37,99,235,0.38)',
              }}
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-full text-base
                         text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700
                         transition-all duration-200"
            >
              {t('ctaSecondary')}
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={6} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-9 pt-7 flex items-center gap-4 border-t border-slate-100"
          >
            <div className="flex -space-x-2.5">
              {AVATAR_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {AVATAR_INITIALS[i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-500">
              <span className="font-bold text-slate-900 text-[1.05rem]">500+</span>{' '}
              {t('familiesLabel')}
              &nbsp;&nbsp;
              <span className="inline-flex items-center gap-[2px]">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: Real photo + authentic badges ─── */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, scale: 0.96, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Photo card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 24px 64px rgba(15,23,42,0.18), 0 0 0 1px rgba(15,23,42,0.06)' }}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt="Cours à domicile à Douala — Pôle d'Excellence Scolaire"
              width={620}
              height={520}
              className="object-cover w-full"
              priority
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

            {/* Location pill in photo */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-white/90 backdrop-blur-sm
                            px-3.5 py-2 rounded-full shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-700">{t('since')}</span>
            </div>
          </div>

          {/* Floating card: 94% réussite */}
          <motion.div
            className="absolute -top-6 -left-8 flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5
                       border border-slate-100 z-10"
            style={{ boxShadow: '0 8px 30px rgba(15,23,42,0.14)' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 leading-none" style={{ fontSize: '1.55rem' }}>94%</p>
              <p className="text-slate-400 text-xs mt-0.5">{t('successRateLabel')}</p>
            </div>
          </motion.div>

          {/* Floating card: N°1 */}
          <motion.div
            className="absolute -bottom-6 -right-6 flex items-center gap-3 rounded-2xl px-4 py-3.5 z-10"
            style={{
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              boxShadow: '0 8px 30px rgba(37,99,235,0.38)',
            }}
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <Award className="w-5 h-5 text-blue-200 flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-sm leading-none">N°1 à Douala</p>
              <p className="text-blue-200 text-xs mt-0.5">Soutien scolaire</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
