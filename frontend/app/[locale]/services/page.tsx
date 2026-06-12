import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check, ArrowRight, Trophy, Gem, BookOpen, Heart,
  Users, TrendingUp, CalendarCheck, ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formules de soutien scolaire à Douala — Élite, Premium, Standard, Sociale | PES',
  description:
    'PES propose 4 formules de cours particuliers à domicile à Douala : Élite (intensif), Premium, Standard et Sociale (accessible). Tous niveaux CP–Terminale. BEPC et BAC inclus.',
  keywords: [
    'formule soutien scolaire Douala',
    'cours particuliers prix Douala',
    'cours à domicile tarif Douala',
    'service elite scolaire Douala',
    'soutien scolaire pas cher Douala',
    'préparation BEPC BAC Douala tarif',
    'cours particuliers niveaux Douala',
  ],
  openGraph: {
    title: 'Formules de soutien scolaire PES Douala — De Élite à Sociale',
    description: '4 formules de cours particuliers à domicile à Douala pour tous les budgets. BEPC et BAC inclus.',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'Formules PES Douala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formules soutien scolaire PES Douala',
    description: '4 formules adaptées à chaque budget. Cours à domicile à Douala.',
    images: ['/images/pes-banner.jpg'],
  },
};

/* ─── Service data ─────────────────────────────────────────── */

const SERVICES = [
  {
    id: 'elite',
    name: 'Service Élite',
    tagline: 'Pour viser le sommet',
    description:
      'Accompagnement intensif conçu pour les élèves qui veulent atteindre l\'excellence absolue. Sessions quotidiennes, enseignant dédié et coaching personnalisé.',
    Icon: Trophy,
    accentColor: '#b45309',
    iconBg: '#fffbeb',
    iconBorder: '#fde68a',
    cardBg: 'linear-gradient(160deg, #fffbeb 0%, #fff7ed 100%)',
    cardBorder: '#fde68a',
    leftBg: 'transparent',
    rightBg: 'rgba(245,158,11,0.04)',
    rightBorder: '#fde68a',
    nameColor: '#78350f',
    taglineColor: '#b45309',
    descColor: '#92400e',
    checkColor: '#b45309',
    featureColor: '#78350f',
    priceColor: '#d97706',
    ctaBg: '#b45309',
    ctaColor: '#ffffff',
    featured: false,
    features: [
      'Sessions quotidiennes (6j/7)',
      'Enseignant dédié exclusif',
      'Suivi personnalisé 24/7',
      'Préparation intensive BEPC / BAC',
      'Ressources premium illimitées',
      'Coaching motivation et gestion du stress',
      'Rapports hebdomadaires détaillés',
      'Consultation psychologue scolaire',
    ],
  },
  {
    id: 'premium',
    name: 'Service Premium',
    tagline: 'La formule la plus choisie',
    description:
      'L\'équilibre parfait entre intensité et flexibilité. Idéale pour une progression rapide et durable tout au long de l\'année scolaire.',
    Icon: Gem,
    accentColor: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.15)',
    iconBorder: 'rgba(96,165,250,0.3)',
    cardBg: 'linear-gradient(160deg, #0c1a3a 0%, #1e3a8a 100%)',
    cardBorder: 'rgba(96,165,250,0.2)',
    leftBg: 'transparent',
    rightBg: 'rgba(255,255,255,0.04)',
    rightBorder: 'rgba(255,255,255,0.1)',
    nameColor: '#ffffff',
    taglineColor: '#fbbf24',
    descColor: 'rgba(191,219,254,0.75)',
    checkColor: '#fbbf24',
    featureColor: 'rgba(219,234,254,0.9)',
    priceColor: 'rgba(147,197,253,0.6)',
    ctaBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    ctaColor: '#0c1a3a',
    featured: true,
    features: [
      '4 séances par semaine',
      'Enseignant attitré',
      'Suivi de progression détaillé',
      'Devoirs et exercices corrigés',
      'Accès plateforme digitale PES',
      'Bilan mensuel avec les parents',
      'Préparation BEPC / BAC',
      'Assistance WhatsApp réactive',
    ],
  },
  {
    id: 'standard',
    name: 'Service Standard',
    tagline: 'L\'essentiel pour progresser',
    description:
      'Deux séances par semaine pour renforcer les bases, combler les lacunes et progresser sereinement. La formule idéale pour démarrer.',
    Icon: BookOpen,
    accentColor: '#4f46e5',
    iconBg: '#eef2ff',
    iconBorder: '#c7d2fe',
    cardBg: '#ffffff',
    cardBorder: '#e0e7ff',
    leftBg: 'transparent',
    rightBg: '#f5f7ff',
    rightBorder: '#e0e7ff',
    nameColor: '#1e1b4b',
    taglineColor: '#4f46e5',
    descColor: '#475569',
    checkColor: '#4f46e5',
    featureColor: '#374151',
    priceColor: '#94a3b8',
    ctaBg: '#3730a3',
    ctaColor: '#ffffff',
    featured: false,
    features: [
      '2 séances par semaine',
      'Exercices ciblés sur les lacunes',
      'Suivi régulier de la progression',
      'Accès aux ressources de base',
      'Bilan trimestriel',
      'Communication régulière avec les parents',
    ],
  },
  {
    id: 'social',
    name: 'Service Social',
    tagline: 'L\'excellence pour tous',
    description:
      'Notre formule solidaire pour rendre l\'excellence scolaire accessible à toutes les familles, quelle que soit leur situation financière.',
    Icon: Heart,
    accentColor: '#15803d',
    iconBg: '#dcfce7',
    iconBorder: '#86efac',
    cardBg: 'linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 100%)',
    cardBorder: '#bbf7d0',
    leftBg: 'transparent',
    rightBg: 'rgba(22,163,74,0.04)',
    rightBorder: '#bbf7d0',
    nameColor: '#14532d',
    taglineColor: '#15803d',
    descColor: '#166534',
    checkColor: '#15803d',
    featureColor: '#14532d',
    priceColor: '#16a34a',
    ctaBg: '#15803d',
    ctaColor: '#ffffff',
    featured: false,
    features: [
      'Tarif adapté à vos ressources',
      'Accompagnement complet',
      'Mêmes exigences de qualité',
      'Enseignants qualifiés',
      'Suivi personnalisé',
      'Dossier de demande simplifié',
    ],
  },
] as const;

/* ─── Trust stats ──────────────────────────────────────────── */

const TRUST_STATS = [
  { icon: TrendingUp,    value: '94%',    label: 'Taux de réussite'     },
  { icon: Users,         value: '500+',   label: 'Familles accompagnées'},
  { icon: CalendarCheck, value: '16 ans', label: 'D\'expérience'        },
  { icon: ShieldCheck,   value: '100%',   label: 'Sans engagement'      },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default async function ServicesPage() {
  const locale = await getLocale();

  return (
    <div className="pt-[72px]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            opacity: 0.4,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

            {/* Left: copy */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1.5 rounded-full"
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
              >
                Nos formules
              </span>
              <h1
                className="font-display font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}
              >
                Un accompagnement<br />
                <span style={{
                  background: 'linear-gradient(95deg, #1d4ed8 0%, #6d28d9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  adapté à chaque élève
                </span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-10">
                Chez PES, nous croyons que chaque enfant mérite un suivi sur mesure.
                Quatre formules, un seul objectif : la réussite de votre enfant.
              </p>

              {/* Trust stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TRUST_STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-extrabold text-slate-900 text-xl leading-none">{value}</span>
                    </div>
                    <span className="text-slate-400 text-xs leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: photo */}
            <div
              className="hidden lg:block rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.15)' }}
            >
              <Image
                src="/images/tutoring-home.jpg"
                alt="Soutien scolaire PES Douala"
                width={420}
                height={360}
                className="object-cover w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#f8faff' }}>
        <div className="max-w-5xl mx-auto space-y-6">
          {SERVICES.map(({
            id, name, tagline, description, Icon,
            accentColor, iconBg, iconBorder,
            cardBg, cardBorder,
            rightBg, rightBorder,
            nameColor, taglineColor, descColor,
            checkColor, featureColor, priceColor,
            ctaBg, ctaColor,
            featured, features,
          }) => (
            <div
              key={id}
              className="relative rounded-2xl overflow-hidden grid lg:grid-cols-[2fr_3fr]"
              style={{
                background: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: featured
                  ? '0 20px 60px rgba(30,58,138,0.28), 0 0 0 1px rgba(96,165,250,0.15)'
                  : '0 4px 20px rgba(15,23,42,0.08)',
              }}
            >
              {/* Popular ribbon */}
              {featured && (
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)' }}
                />
              )}

              {/* Left panel: identity */}
              <div className="p-7 lg:p-9 flex flex-col justify-between gap-6">
                <div>
                  {/* Badge "Le plus populaire" */}
                  {featured && (
                    <span
                      className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-5"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#0c1a3a',
                      }}
                    >
                      ★ Le plus populaire
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: accentColor }} />
                  </div>

                  {/* Name */}
                  <h2
                    className="font-display font-extrabold text-2xl mb-1"
                    style={{ color: nameColor }}
                  >
                    {name}
                  </h2>

                  {/* Tagline */}
                  <p
                    className="text-xs font-bold uppercase tracking-[0.14em] mb-4"
                    style={{ color: taglineColor }}
                  >
                    {tagline}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: descColor }}
                  >
                    {description}
                  </p>
                </div>

                {/* CTA block */}
                <div>
                  <p
                    className="text-xs italic mb-4"
                    style={{ color: priceColor }}
                  >
                    Tarif communiqué lors du bilan pédagogique gratuit
                  </p>
                  <Link
                    href={`/${locale}/inscription`}
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full
                               transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
                    style={{
                      background: ctaBg,
                      color: ctaColor,
                      boxShadow: featured ? '0 4px 20px rgba(245,158,11,0.35)' : 'none',
                    }}
                  >
                    Choisir cette formule
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right panel: features */}
              <div
                className="p-7 lg:p-9"
                style={{
                  background: rightBg,
                  borderLeft: `1px solid ${rightBorder}`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
                  style={{ color: featured ? 'rgba(147,197,253,0.6)' : '#94a3b8' }}
                >
                  Ce qui est inclus
                </p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: checkColor }}
                      />
                      <span
                        className="text-sm leading-snug"
                        style={{ color: featureColor }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto mt-12">
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
              >
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Bilan pédagogique gratuit</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Première séance d'évaluation offerte, sans engagement. Nous choisissons ensemble la formule adaptée.
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/inscription`}
              className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full
                         text-white whitespace-nowrap transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
              }}
            >
              Réserver mon bilan gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
