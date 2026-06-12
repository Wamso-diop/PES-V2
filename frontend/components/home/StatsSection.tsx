'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Trophy, CalendarCheck, BookOpen } from 'lucide-react';

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const duration = 1800;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  {
    key: 'students' as const,
    value: 500,
    suffix: '+',
    icon: Users,
    accent: '#1d4ed8',
    iconBg: '#eff6ff',
    iconBorder: '#bfdbfe',
    topBar: '#1d4ed8',
  },
  {
    key: 'successRate' as const,
    value: 94,
    suffix: '%',
    icon: Trophy,
    accent: '#b45309',
    iconBg: '#fffbeb',
    iconBorder: '#fde68a',
    topBar: '#d97706',
  },
  {
    key: 'years' as const,
    value: 16,
    suffix: '+',
    icon: CalendarCheck,
    accent: '#1d4ed8',
    iconBg: '#eff6ff',
    iconBorder: '#bfdbfe',
    topBar: '#1d4ed8',
  },
  {
    key: 'subjects' as const,
    value: 30,
    suffix: '+',
    icon: BookOpen,
    accent: '#b45309',
    iconBg: '#fffbeb',
    iconBorder: '#fde68a',
    topBar: '#d97706',
  },
];

export default function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Chiffres clés
          </motion.span>
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold text-slate-900"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            {t('title')}
          </motion.h2>
        </div>

        {/* Cards — Material elevation style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ key, value, suffix, icon: Icon, accent, iconBg, iconBorder, topBar }, i) => (
            <motion.div
              key={key}
              className="group bg-white rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
                borderTop: `3px solid ${topBar}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              whileHover={{
                y: -6,
                boxShadow: '0 2px 4px rgba(0,0,0,0.06), 0 10px 28px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.04)',
                transition: { duration: 0.2 },
              }}
            >
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-13 h-13 rounded-xl mb-5 mx-auto"
                style={{
                  width: 52,
                  height: 52,
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: accent }} />
              </div>

              {/* Counter */}
              <div
                className="font-display font-extrabold leading-none mb-2"
                style={{ fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)', color: accent }}
              >
                <CountUp target={value} suffix={suffix} />
              </div>

              {/* Label */}
              <p className="text-slate-500 text-sm font-medium leading-snug">
                {t(key)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
