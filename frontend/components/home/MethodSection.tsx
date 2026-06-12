'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ClipboardCheck, LayoutList, TrendingUp, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    key: 'step1' as const,
    icon: ClipboardCheck,
    number: '01',
    accent: '#f59e0b',
  },
  {
    key: 'step2' as const,
    icon: LayoutList,
    number: '02',
    accent: '#2563eb',
  },
  {
    key: 'step3' as const,
    icon: TrendingUp,
    number: '03',
    accent: '#f59e0b',
  },
];

export default function MethodSection() {
  const t = useTranslations('method');

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Méthodologie
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {t('title')}
          </h2>
        </motion.div>

        {/* Split layout: image left, steps right */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">

          {/* Left: real photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative frame */}
            <div
              className="absolute -inset-3 rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #fef3c7 100%)', zIndex: 0 }}
            />

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden z-10"
              style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.16)' }}>
              <Image
                src="/images/teacher-premium.jpg"
                alt="Enseignant PES et élève — méthode d'excellence"
                width={580}
                height={480}
                className="object-cover w-full"
              />
              {/* Overlay subtle */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
            </div>

            {/* Floating badge: "L'excellence est un choix" */}
            <motion.div
              className="absolute -bottom-6 -right-4 z-20 bg-slate-900 text-white rounded-2xl px-5 py-3.5
                         border border-white/10"
              style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.25)' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-bold text-sm italic">« L'excellence est un choix »</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: 3 steps */}
          <div className="space-y-0">
            {STEPS.map(({ key, icon: Icon, number, accent }, i) => (
              <motion.div
                key={key}
                className="relative flex gap-6 pb-10 last:pb-0"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Timeline column */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {/* Icon circle */}
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center z-10 shadow-lg"
                    style={{ background: accent }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                    <div
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100"
                    >
                      <span className="text-[10px] font-black" style={{ color: accent }}>{number}</span>
                    </div>
                  </div>

                  {/* Vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 mt-3"
                      style={{ background: 'linear-gradient(to bottom, #e2e8f0, transparent)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 pb-2">
                  <h3 className="font-display font-bold text-slate-900 text-lg mb-2">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    {t(`${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
