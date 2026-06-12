'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Flame, Trophy, Gem, BookOpen, Heart, Clock } from 'lucide-react';

type PlanKey = 'elite' | 'premium' | 'standard' | 'social';

const PLANS = [
  {
    key: 'elite'    as PlanKey,
    Icon: Trophy,
    number: '01',
    featured: false,
    topBar:      'linear-gradient(90deg,#f59e0b,#d97706)',
    iconBg:      '#fef3c7',
    accentColor: '#b45309',
    pillBg:      '#fff7ed',
    pillBorder:  '#fde68a',
    divider:     '#fde68a',
    checkRing:   '#fef3c7',
    checkColor:  '#b45309',
    ctaBg:       '#b45309',
    ctaShadow:   '0 6px 20px rgba(180,83,9,0.28)',
    numColor:    '#fde68a',
    border:      '1.5px solid #fde68a',
    shadow:      '0 4px 28px rgba(180,83,9,0.08)',
  },
  {
    key: 'premium'  as PlanKey,
    Icon: Gem,
    number: '02',
    featured: true,
    topBar:      'linear-gradient(90deg,#f59e0b,#fbbf24,#d97706)',
    iconBg:      'rgba(251,191,36,0.12)',
    accentColor: '#fbbf24',
    pillBg:      'rgba(255,255,255,0.08)',
    pillBorder:  'rgba(251,191,36,0.22)',
    divider:     'rgba(255,255,255,0.09)',
    checkRing:   'rgba(251,191,36,0.12)',
    checkColor:  '#fbbf24',
    ctaBg:       'linear-gradient(135deg,#f59e0b,#d97706)',
    ctaShadow:   '0 6px 26px rgba(245,158,11,0.45)',
    numColor:    'rgba(255,255,255,0.05)',
    border:      '1.5px solid rgba(251,191,36,0.20)',
    shadow:      '0 32px 80px rgba(12,26,58,0.45), 0 0 0 1.5px rgba(251,191,36,0.18)',
  },
  {
    key: 'standard' as PlanKey,
    Icon: BookOpen,
    number: '03',
    featured: false,
    topBar:      'linear-gradient(90deg,#6d28d9,#4f46e5)',
    iconBg:      '#ede9fe',
    accentColor: '#4f46e5',
    pillBg:      '#f5f3ff',
    pillBorder:  '#ddd6fe',
    divider:     '#ddd6fe',
    checkRing:   '#ede9fe',
    checkColor:  '#4f46e5',
    ctaBg:       '#3730a3',
    ctaShadow:   '0 6px 20px rgba(55,48,163,0.28)',
    numColor:    '#ede9fe',
    border:      '1.5px solid #ddd6fe',
    shadow:      '0 4px 28px rgba(79,70,229,0.07)',
  },
  {
    key: 'social'   as PlanKey,
    Icon: Heart,
    number: '04',
    featured: false,
    topBar:      'linear-gradient(90deg,#15803d,#16a34a)',
    iconBg:      '#dcfce7',
    accentColor: '#15803d',
    pillBg:      '#f0fdf4',
    pillBorder:  '#86efac',
    divider:     '#bbf7d0',
    checkRing:   '#dcfce7',
    checkColor:  '#15803d',
    ctaBg:       '#15803d',
    ctaShadow:   '0 6px 20px rgba(21,128,61,0.28)',
    numColor:    '#dcfce7',
    border:      '1.5px solid #bbf7d0',
    shadow:      '0 4px 28px rgba(21,128,61,0.07)',
  },
] as const;

export default function ClassesSection() {
  const t      = useTranslations('classes');
  const locale = useLocale();

  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <span className="h-px w-10 bg-amber-400" />
            <span className="text-amber-600 text-[11px] font-extrabold uppercase tracking-[0.22em]">
              {t('title')}
            </span>
            <span className="h-px w-10 bg-amber-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-display font-extrabold text-4xl md:text-5xl text-slate-900 leading-tight"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-5 text-slate-400 text-lg max-w-md mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:items-stretch">
          {PLANS.map((plan, i) => {
            const features = t.raw(`${plan.key}.features`) as string[];
            const rhythm   = t(`${plan.key}.rhythm` as Parameters<typeof t>[0]);

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: plan.featured ? -6 : -10, transition: { duration: 0.22 } }}
                className="relative rounded-3xl overflow-hidden flex flex-col"
                style={{
                  background: plan.featured
                    ? 'linear-gradient(160deg, #08142e 0%, #112260 100%)'
                    : '#ffffff',
                  border:     plan.border,
                  boxShadow:  plan.shadow,
                  ...(plan.featured ? { marginTop: '-16px', marginBottom: '-16px', zIndex: 10 } : {}),
                }}
              >
                {/* Top accent bar */}
                <div className="h-[3px]" style={{ background: plan.topBar }} />

                {/* Decorative number */}
                <div
                  className="absolute top-4 right-5 font-black text-[4rem] leading-none
                             select-none pointer-events-none"
                  style={{ color: plan.numColor }}
                >
                  {plan.number}
                </div>

                {/* Popular badge */}
                {plan.featured && (
                  <div className="flex justify-center pt-6">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold
                                 px-4 py-1.5 rounded-full uppercase tracking-wider"
                      style={{
                        background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                        color: '#0c1a3a',
                      }}
                    >
                      <Flame className="w-3 h-3" />
                      {t('premium.badge')}
                    </span>
                  </div>
                )}

                <div className={`flex flex-col flex-1 px-7 ${plan.featured ? 'pt-6 pb-8' : 'pt-8 pb-8'}`}>

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
                    style={{ background: plan.iconBg }}
                  >
                    <plan.Icon className="w-6 h-6" style={{ color: plan.accentColor }} />
                  </div>

                  {/* Plan name */}
                  <h3
                    className="font-display font-extrabold text-[1.4rem] leading-tight mb-3"
                    style={{ color: plan.featured ? '#ffffff' : '#0f172a' }}
                  >
                    {t(`${plan.key}.name`)}
                  </h3>

                  {/* Rhythm pill */}
                  <div
                    className="inline-flex items-center gap-1.5 self-start text-[11px] font-bold
                               px-3 py-1 rounded-full mb-4"
                    style={{
                      background:   plan.pillBg,
                      color:        plan.accentColor,
                      border:       `1px solid ${plan.pillBorder}`,
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {rhythm}
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: plan.featured ? 'rgba(191,219,254,0.75)' : '#64748b' }}
                  >
                    {t(`${plan.key}.desc`)}
                  </p>

                  {/* Divider */}
                  <div className="mb-6 h-px" style={{ background: plan.divider }} />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-7">
                    {features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div
                          className="w-[22px] h-[22px] rounded-full flex items-center justify-center
                                     flex-shrink-0 mt-[1px]"
                          style={{ background: plan.checkRing }}
                        >
                          <Check className="w-3 h-3" style={{ color: plan.checkColor }} />
                        </div>
                        <span
                          className="text-[13px] leading-snug"
                          style={{ color: plan.featured ? 'rgba(219,234,254,0.90)' : '#334155' }}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Price note */}
                  <p
                    className="text-[11px] italic text-center mb-5"
                    style={{ color: plan.featured ? 'rgba(147,197,253,0.50)' : '#94a3b8' }}
                  >
                    {t('priceInfo')}
                  </p>

                  {/* CTA */}
                  <Link
                    href={`/${locale}/inscription`}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl
                               font-bold text-sm transition-all duration-200
                               hover:opacity-90 hover:scale-[1.015]"
                    style={{
                      background:  plan.ctaBg,
                      color:       plan.featured ? '#0c1a3a' : '#ffffff',
                      boxShadow:   plan.ctaShadow,
                    }}
                  >
                    {t('cta')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
