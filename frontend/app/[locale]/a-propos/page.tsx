import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award, Users, Target, Heart,
  GraduationCap, BookOpen, Globe, Trophy,
  ArrowRight, Quote,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos — Histoire et équipe de PES, soutien scolaire Douala',
  description:
    'Découvrez l\'histoire de PES, fondé en 2010 par Alain FUMTUM. 15 ans d\'excellence, 94% de réussite, 500+ familles accompagnées à Douala, Cameroun.',
  keywords: [
    'PES Douala histoire',
    'Alain FUMTUM fondateur',
    'soutien scolaire Douala depuis 2010',
    'équipe enseignants Douala',
    'Pôle Excellence Scolaire fondation',
  ],
  openGraph: {
    title: 'À propos de PES — N°1 du soutien scolaire à Douala depuis 2010',
    description: '15 ans d\'excellence pédagogique. Rencontrez l\'équipe qui accompagne 500+ familles à Douala.',
    images: [{ url: '/images/pes-banner.jpg', width: 1200, height: 630, alt: 'PES Douala équipe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de PES Douala',
    description: '15 ans d\'excellence en soutien scolaire à Douala.',
    images: ['/images/pes-banner.jpg'],
  },
};

/* ─── Data ─── */

const TIMELINE = [
  {
    year: '2010',
    title: 'Fondation de PES',
    desc: 'Alain FUMTUM, ingénieur UCAC-ICAM, crée PES avec une vision claire : rendre l\'excellence scolaire accessible à tous les élèves de Douala.',
    accent: '#1d4ed8',
  },
  {
    year: '2013',
    title: 'Première expansion',
    desc: 'PES passe de 20 à 100 élèves. Recrutement des premiers enseignants certifiés et développement du programme pédagogique structuré.',
    accent: '#7c3aed',
  },
  {
    year: '2016',
    title: '94% de réussite',
    desc: 'Premier bilan quinquennal : 94% de taux de réussite aux examens nationaux (BEPC et BAC). Un record maintenu chaque année depuis.',
    accent: '#b45309',
  },
  {
    year: '2019',
    title: 'Formule Sociale lancée',
    desc: 'Lancement de la formule solidaire pour rendre nos services accessibles aux familles à revenus modestes. L\'excellence n\'est pas un privilège.',
    accent: '#15803d',
  },
  {
    year: '2022',
    title: '500+ familles accompagnées',
    desc: 'PES franchit le cap des 500 familles. Lancement de la plateforme digitale pour le suivi en temps réel des progrès de chaque élève.',
    accent: '#1d4ed8',
  },
  {
    year: '2024',
    title: 'Expansion bilinguisme',
    desc: 'Renforcement du programme bilingue FR/EN pour préparer les élèves aux exigences du monde professionnel international.',
    accent: '#7c3aed',
  },
];

const CREDENTIALS = [
  { Icon: GraduationCap, text: 'Ingénieur diplômé de l\'UCAC-ICAM de Douala' },
  { Icon: BookOpen,      text: '16+ années d\'expérience en pédagogie'        },
  { Icon: Trophy,        text: 'Formé aux meilleures méthodes d\'apprentissage'},
  { Icon: Globe,         text: 'Engagé pour l\'éducation en Afrique'           },
];

const VALUES = [
  {
    Icon: Award,
    title: 'Excellence',
    desc: 'Nous n\'acceptons pas la médiocrité. Chaque cours, chaque exercice, chaque correction vise le plus haut niveau de qualité.',
    accent: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    iconBg: '#fef3c7',
  },
  {
    Icon: Users,
    title: 'Accessibilité',
    desc: 'L\'excellence scolaire ne doit pas être un privilège réservé à quelques-uns. Notre formule sociale garantit l\'accès à tous.',
    accent: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
    iconBg: '#dbeafe',
  },
  {
    Icon: Target,
    title: 'Résultats',
    desc: 'Nous nous engageons sur des résultats concrets et mesurables, pas sur des promesses en l\'air. 94% parlent pour nous.',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    iconBg: '#ede9fe',
  },
  {
    Icon: Heart,
    title: 'Bienveillance',
    desc: 'Chaque élève est unique. Nous créons un environnement sûr, encourageant et motivant où chacun peut s\'épanouir.',
    accent: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    iconBg: '#dcfce7',
  },
];

const STATS = [
  { value: '2010',  label: 'Année de création'      },
  { value: '94%',   label: 'Taux de réussite'        },
  { value: '500+',  label: 'Familles accompagnées'   },
  { value: '30+',   label: 'Matières enseignées'     },
];

/* ─── Page ─── */

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <div className="pt-[72px]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom right, black 20%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom right, black 20%, transparent 70%)',
            opacity: 0.4,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_480px] gap-14 items-center">

            {/* Left */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-5 px-3 py-1.5 rounded-full"
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
              >
                Notre histoire
              </span>
              <h1
                className="font-display font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}
              >
                16 ans au service de<br />
                <span style={{
                  background: 'linear-gradient(95deg, #1d4ed8 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  l&apos;excellence scolaire
                </span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-10">
                PES est né d'une conviction profonde : chaque élève peut réussir
                s'il est bien accompagné. Depuis 2010, nous transformons cette
                conviction en résultats concrets à Douala.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className="font-display font-extrabold leading-none mb-1"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', color: '#1e40af' }}
                    >
                      {value}
                    </p>
                    <p className="text-slate-400 text-xs leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: brand visual */}
            <div
              className="hidden lg:block rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.15)' }}
            >
              <Image
                src="/images/students-class.jpg"
                alt="Élèves PES en classe à Douala"
                width={480}
                height={380}
                className="object-cover w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section
        className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
        style={{ background: '#f8faff' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[480px_1fr] gap-14 items-center">

            {/* Left: photo */}
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-3xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #fef3c7 100%)', zIndex: 0 }}
              />
              <div
                className="relative rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.16)' }}
              >
                <Image
                  src="/images/teacher-premium.jpg"
                  alt="Alain FUMTUM — Fondateur de PES"
                  width={480}
                  height={420}
                  className="object-cover w-full"
                />
                {/* Name overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-6 py-5"
                  style={{
                    background: 'linear-gradient(to top, rgba(15,23,42,0.88), transparent)',
                  }}
                >
                  <p className="font-display font-extrabold text-white text-lg leading-tight">
                    Alain FUMTUM
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">
                    Fondateur &amp; Directeur pédagogique
                  </p>
                </div>
              </div>
            </div>

            {/* Right: bio */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1.5 rounded-full"
                style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
              >
                Le fondateur
              </span>

              <h2
                className="font-display font-extrabold text-slate-900 leading-tight mb-1"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
              >
                Alain FUMTUM
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Ingénieur UCAC-ICAM · Fondateur &amp; Directeur pédagogique
              </p>

              {/* Quote */}
              <div
                className="relative rounded-2xl p-6 mb-8"
                style={{
                  background: 'white',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
                }}
              >
                <Quote
                  className="w-7 h-7 mb-3"
                  style={{ color: '#bfdbfe' }}
                />
                <p className="text-slate-600 italic leading-relaxed text-[0.95rem]">
                  J&apos;ai créé PES parce que j&apos;ai vu trop d&apos;élèves brillants échouer
                  faute d&apos;un accompagnement adapté. Ma mission est de changer ça,
                  un élève à la fois.
                </p>
              </div>

              {/* Credentials */}
              <div className="space-y-3 mb-8">
                {CREDENTIALS.map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm">{text}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/inscription`}
                className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full
                           text-white transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
                }}
              >
                S&apos;inscrire
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission banner ── */}
      <section className="relative py-20 overflow-hidden">
        <Image
          src="/images/hero-brand.jpg"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(14,30,80,0.93) 0%, rgba(30,58,138,0.89) 60%, rgba(14,30,80,0.93) 100%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em] mb-5"
            style={{ color: 'rgba(251,191,36,0.9)' }}
          >
            Notre mission
          </p>
          <h2
            className="font-display font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Aider vos enfants à<br />
            <span style={{
              background: 'linear-gradient(95deg, #fbbf24 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              déployer leurs ailes
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'rgba(191,219,254,0.8)' }}
          >
            Éduquer, élever, faire exceller. Ce ne sont pas que des mots pour nous —
            ce sont les engagements que nous prenons envers chaque famille qui nous confie son enfant.
          </p>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-3 py-1.5 rounded-full"
              style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
            >
              Notre parcours
            </span>
            <h2
              className="font-display font-extrabold text-slate-900"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
            >
              Les étapes clés de PES
            </h2>
          </div>

          {/* Timeline list */}
          <div className="relative">

            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-0 bottom-0 w-[2px] sm:left-1/2 sm:-translate-x-px"
              style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #ddd6fe 50%, #bbf7d0 100%)' }}
            />

            <div className="space-y-10">
              {TIMELINE.map(({ year, title, desc, accent }, i) => (
                <div
                  key={year}
                  className={`relative flex gap-8 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Desktop: content side */}
                  <div
                    className={`hidden sm:flex sm:w-1/2 ${
                      i % 2 === 0
                        ? 'pr-12 flex-col items-end text-right'
                        : 'pl-12 flex-col items-start text-left'
                    }`}
                  >
                    <span
                      className="inline-block text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-2"
                      style={{ background: accent, color: '#fff' }}
                    >
                      {year}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 text-base mb-1">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                      {desc}
                    </p>
                  </div>

                  {/* Dot */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-0"
                    style={{
                      border: `3px solid ${accent}`,
                      boxShadow: `0 0 0 4px ${accent}22`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: accent }}
                    />
                  </div>

                  {/* Mobile: content / Desktop: spacer */}
                  <div className={`flex-1 sm:w-1/2 ${i % 2 === 0 ? 'sm:pl-12' : 'sm:pr-12'}`}>
                    {/* Mobile only */}
                    <div className="sm:hidden">
                      <span
                        className="inline-block text-xs font-extrabold px-3 py-1 rounded-full mb-2"
                        style={{ background: accent, color: '#fff' }}
                      >
                        {year}
                      </span>
                      <h3 className="font-display font-bold text-slate-900 text-base mb-1">
                        {title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
        style={{ background: '#f8faff' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-3 py-1.5 rounded-full"
              style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
            >
              Ce qui nous guide
            </span>
            <h2
              className="font-display font-extrabold text-slate-900"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
            >
              Nos valeurs fondamentales
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ Icon, title, desc, accent, bg, border, iconBg }) => (
              <div
                key={title}
                className="rounded-2xl p-7 flex gap-5 transition-transform duration-200 hover:-translate-y-1"
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  boxShadow: '0 2px 12px rgba(15,23,42,0.07)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: iconBg, border: `1px solid ${border}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="font-display font-bold text-lg mb-2"
                    style={{ color: accent }}
                  >
                    {title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
