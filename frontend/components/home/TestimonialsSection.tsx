'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Patricia Mbeki',
    role: 'Mère de Léa — 3ème',
    location: 'Bonanjo',
    initials: 'PM',
    color: '#1e40af',
    stars: 5,
    highlight: 'mention Bien au BEPC',
    text: 'Grâce à PES, ma fille a eu mention Bien au BEPC. Les enseignants sont exceptionnels et très à l\'écoute. Je recommande vivement à toutes les familles de Douala !',
  },
  {
    name: 'Samuel Biya',
    role: 'Père de Marc — Terminale C',
    location: 'Akwa',
    initials: 'SB',
    color: '#d97706',
    stars: 5,
    highlight: '16/20 en Maths',
    text: 'Mon fils était en difficulté en Maths et Physique. En 6 mois avec PES, il est passé de la moyenne à 16/20. Des résultats concrets, pas des promesses.',
  },
  {
    name: 'Aïcha Ngom',
    role: 'Mère de Yanis — 4ème',
    location: 'Makepe',
    initials: 'AN',
    color: '#1e40af',
    stars: 5,
    highlight: 'suivi rigoureux',
    text: 'Le suivi est rigoureux et les rapports mensuels très utiles. On voit vraiment la progression semaine après semaine. PES tient ses engagements.',
  },
  {
    name: 'Francis Tchouambe',
    role: 'Père de Sophie — Terminale A',
    location: 'Bonapriso',
    initials: 'FT',
    color: '#d97706',
    stars: 5,
    highlight: 'BAC avec mention',
    text: 'Formule Élite pour le BAC : Sophie l\'a eu avec mention. L\'investissement en vaut largement la peine. Professeurs au top niveau, méthode irréprochable.',
  },
] as const;

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#f8faff' }}>

      {/* Decorative bg photo — blurred */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/students-class.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.04] blur-sm"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Témoignages
          </motion.span>
          <motion.h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.name}
              className="relative bg-white rounded-2xl p-7 flex flex-col gap-5"
              style={{
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 16px rgba(15,23,42,0.07)',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(15,23,42,0.11)', transition: { duration: 0.2 } }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-blue-100 flex-shrink-0" />

              {/* Highlighted result */}
              <span
                className="inline-block self-start text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
              >
                ✓ {item.highlight}
              </span>

              {/* Quote text */}
              <p className="text-slate-600 leading-relaxed text-sm sm:text-[0.925rem] flex-1 italic">
                « {item.text} »
              </p>

              {/* Author row */}
              <div className="flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid #f1f5f9' }}>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.role} · {item.location}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: item.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global rating */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full"
            style={{
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 2px 16px rgba(15,23,42,0.08)',
            }}
          >
            <div className="flex items-center gap-[3px]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-extrabold text-slate-900 text-base">4.9 / 5</span>
            <span className="text-slate-400 text-sm">— basé sur 120+ avis</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
