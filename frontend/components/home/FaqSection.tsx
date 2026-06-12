'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

interface FaqItem { q: string; a: string }

export default function FaqSection() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = t.raw('items') as FaqItem[];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 lg:gap-20 items-start">

          {/* ── LEFT ── */}
          <div>
            <motion.span
              className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              FAQ
            </motion.span>
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('title')}
            </motion.h2>
            <motion.p
              className="mt-4 text-slate-500 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* Photo card replacing emoji placeholder */}
            <motion.div
              className="hidden lg:block mt-10 rounded-2xl overflow-hidden relative"
              style={{ boxShadow: '0 12px 40px rgba(15,23,42,0.14)' }}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/cours-domicile.jpg"
                alt="Cours à domicile à Douala"
                width={480}
                height={300}
                className="object-cover w-full"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6"
                style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 55%, transparent 100%)' }}
              >
                <h3 className="font-bold text-white text-base mb-1.5">
                  Une autre question ?
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Notre équipe répond en moins de 24h.
                </p>
                <a
                  href="https://wa.me/237690041633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Nous contacter
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Accordion ── */}
          <div className="space-y-2.5">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  className="rounded-2xl overflow-hidden transition-colors duration-200"
                  style={{
                    border: isOpen ? '1.5px solid #bfdbfe' : '1.5px solid #f1f5f9',
                    background: isOpen ? '#f8fbff' : '#ffffff',
                    boxShadow: isOpen ? '0 4px 16px rgba(37,99,235,0.08)' : '0 1px 6px rgba(15,23,42,0.05)',
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`font-semibold text-sm sm:text-[0.925rem] leading-snug ${isOpen ? 'text-blue-900' : 'text-slate-800'}`}>
                      {item.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isOpen ? '#1e40af' : '#f1f5f9',
                        color: isOpen ? '#fff' : '#64748b',
                      }}
                    >
                      {isOpen
                        ? <Minus className="w-3.5 h-3.5" />
                        : <Plus className="w-3.5 h-3.5" />
                      }
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
