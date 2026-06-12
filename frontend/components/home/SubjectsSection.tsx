'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Calculator, FlaskConical, Leaf, Monitor,
  BookOpen, Globe, Map, Lightbulb, TrendingUp,
  FileSpreadsheet, Wrench, Cpu,
  Flame, Globe2, Sparkles,
} from 'lucide-react';

type Tag = 'hot' | 'bilingual' | 'new';

interface Subject {
  name: string;
  level: string;
  tag: Tag | null;
  Icon: React.ElementType;
}

interface Category {
  id: string;
  label: string;
  count: string;
  accent: string;          // icon & accent colour
  headerBg: string;        // column header background
  headerBorder: string;
  cardBorder: string;
  iconBg: string;
  subjects: Subject[];
}

const CATEGORIES: Category[] = [
  {
    id: 'sciences',
    label: 'Sciences & Maths',
    count: '4 matières',
    accent: '#1d4ed8',
    headerBg: '#eff6ff',
    headerBorder: '#bfdbfe',
    cardBorder: '#e0eaff',
    iconBg: '#dbeafe',
    subjects: [
      { name: 'Mathématiques',   level: 'Collège · Lycée', tag: 'hot',  Icon: Calculator   },
      { name: 'Physique-Chimie', level: 'Collège · Lycée', tag: 'hot',  Icon: FlaskConical },
      { name: 'SVT',             level: 'Collège · Lycée', tag: 'hot',  Icon: Leaf         },
      { name: 'Informatique',    level: 'Lycée',           tag: 'new',  Icon: Monitor      },
    ],
  },
  {
    id: 'lettres',
    label: 'Lettres & Humanités',
    count: '5 matières',
    accent: '#b45309',
    headerBg: '#fffbeb',
    headerBorder: '#fde68a',
    cardBorder: '#fef3c7',
    iconBg: '#fef3c7',
    subjects: [
      { name: 'Français',            level: 'Collège · Lycée', tag: 'hot',       Icon: BookOpen   },
      { name: 'English',             level: 'Collège · Lycée', tag: 'bilingual', Icon: Globe      },
      { name: 'Histoire-Géographie', level: 'Collège · Lycée', tag: null,        Icon: Map        },
      { name: 'Philosophie',         level: 'Lycée',           tag: null,        Icon: Lightbulb  },
      { name: 'Économie',            level: 'Lycée',           tag: null,        Icon: TrendingUp },
    ],
  },
  {
    id: 'technique',
    label: 'Filière Technique',
    count: '3 matières',
    accent: '#15803d',
    headerBg: '#f0fdf4',
    headerBorder: '#bbf7d0',
    cardBorder: '#dcfce7',
    iconBg: '#dcfce7',
    subjects: [
      { name: 'Comptabilité', level: 'Lycée Technique', tag: null,  Icon: FileSpreadsheet },
      { name: 'Mécanique',    level: 'Lycée Technique', tag: 'new', Icon: Wrench          },
      { name: 'Électronique', level: 'Lycée Technique', tag: 'new', Icon: Cpu             },
    ],
  },
];

const TAG_CONFIG: Record<Tag, {
  label: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}> = {
  hot:       { label: 'Très demandé', Icon: Flame,    color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  bilingual: { label: 'Bilingue',     Icon: Globe2,   color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  new:       { label: 'Nouveau',      Icon: Sparkles, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
};

const colVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function SubjectsSection() {
  const t = useTranslations('subjects');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.22em] mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Programme
          </motion.span>
          <motion.h2
            className="font-display font-extrabold text-slate-900 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.id}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                border: `1.5px solid ${cat.cardBorder}`,
                boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: ci * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Column header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                  background: cat.headerBg,
                  borderBottom: `1.5px solid ${cat.headerBorder}`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-6 rounded-full"
                    style={{ background: cat.accent }}
                  />
                  <h3 className="font-display font-bold text-slate-900 text-sm">
                    {cat.label}
                  </h3>
                </div>
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'white',
                    color: cat.accent,
                    border: `1px solid ${cat.headerBorder}`,
                  }}
                >
                  {cat.count}
                </span>
              </div>

              {/* Subject rows */}
              <motion.div
                className="flex flex-col bg-white"
                variants={colVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {cat.subjects.map((subject, si) => {
                  const tagConf = subject.tag ? TAG_CONFIG[subject.tag] : null;
                  const SubIcon = subject.Icon;
                  const isLast = si === cat.subjects.length - 1;

                  return (
                    <motion.div
                      key={subject.name}
                      className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors duration-150"
                      style={{
                        borderBottom: isLast ? 'none' : `1px solid ${cat.cardBorder}`,
                        cursor: 'default',
                      }}
                      variants={rowVariants}
                      whileHover={{
                        background: cat.headerBg,
                        transition: { duration: 0.12 },
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{
                          background: cat.iconBg,
                          border: `1px solid ${cat.headerBorder}`,
                        }}
                      >
                        <SubIcon className="w-4 h-4" style={{ color: cat.accent }} />
                      </div>

                      {/* Name + level */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                          {subject.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{subject.level}</p>
                      </div>

                      {/* Tag */}
                      {tagConf && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: tagConf.bg,
                            color: tagConf.color,
                            border: `1px solid ${tagConf.border}`,
                          }}
                        >
                          <tagConf.Icon className="w-2.5 h-2.5" />
                          {tagConf.label}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center mt-8 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          D'autres matières disponibles sur demande selon le niveau et la filière.
        </motion.p>
      </div>
    </section>
  );
}
