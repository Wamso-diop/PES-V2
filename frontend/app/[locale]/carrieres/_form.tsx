'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CheckCircle, Upload, Send, Check,
  Clock, Building2, ArrowRight,
  GraduationCap, Star, BookOpen, Heart,
} from 'lucide-react';

/* ─── Benefits ─── */

const BENEFITS = [
  'Horaires flexibles adaptés à votre emploi du temps',
  'Rémunération attractive et ponctuelle',
  'Formation continue à nos méthodes pédagogiques',
  'Ambiance de travail stimulante et bienveillante',
  'Matériaux pédagogiques fournis',
  'Réseau professionnel solide',
];

const POSTES = [
  'Professeur de Mathématiques',
  'Professeur de Physique-Chimie',
  'Professeur de Français',
  'Professeur d\'Anglais',
  'Professeur de SVT',
  'Professeur de Philosophie',
  'Professeur d\'Histoire-Géographie',
  'Professeur d\'Économie',
  'Coordinateur pédagogique',
];

/* ─── Recruitment tiers ─── */

interface Tier {
  id: string;
  label: string;
  Icon: React.ElementType;
  experience: string;
  schools: string;
  qualites: string[];
  responsabilites: string[];
  avantages: string[];
  accent: string;
  headerBg: string;
  headerBorder: string;
  cardBorder: string;
  iconBg: string;
  nameColor: string;
  mutedColor: string;
  textColor: string;
  sectionLabelColor: string;
  dividerColor: string;
  ctaStyle: React.CSSProperties;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'elite',
    label: 'Service Élite',
    Icon: GraduationCap,
    experience: '5 ans+ d\'expérience',
    schools: 'Collège Libermann, DUVAL, Laval...',
    qualites: [
      'Rigueur, discipline et créativité pédagogique',
      'Capacité à motiver et stimuler les élèves',
      'Adaptation des méthodes aux besoins individuels',
      'Gestion de classe efficace et bienveillante',
    ],
    responsabilites: [
      'Suivi personnalisé de chaque élève',
      'Préparation de cours de haute qualité',
      'Participation aux réunions parents & activités',
    ],
    avantages: ['Rémunération attractive', 'Environnement stimulant', 'Développement professionnel'],
    accent: '#b45309',
    headerBg: '#fffbeb',
    headerBorder: '#fde68a',
    cardBorder: '#fef3c7',
    iconBg: '#fef3c7',
    nameColor: '#78350f',
    mutedColor: '#92400e',
    textColor: '#78350f',
    sectionLabelColor: '#b45309',
    dividerColor: '#fde68a',
    ctaStyle: { background: '#b45309', color: '#fff' },
    featured: true,
  },
  {
    id: 'premium',
    label: 'Service Premium',
    Icon: Star,
    experience: '3 à 5 ans d\'expérience',
    schools: 'Lycée Joss, Lycée de Makepe...',
    qualites: [
      'Rigueur, discipline et communication efficace',
      'Capacité à travailler en équipe',
      'Enseignement interactif et participatif',
      'Évaluation régulière des progrès des élèves',
    ],
    responsabilites: [
      'Suivi personnalisé des élèves',
      'Préparation de cours de qualité',
      'Participation aux réunions parents & activités',
    ],
    avantages: ['Rémunération attractive', 'Environnement stimulant', 'Développement professionnel'],
    accent: '#1d4ed8',
    headerBg: '#eff6ff',
    headerBorder: '#bfdbfe',
    cardBorder: '#e0eaff',
    iconBg: '#dbeafe',
    nameColor: '#1e1b4b',
    mutedColor: '#3730a3',
    textColor: '#374151',
    sectionLabelColor: '#2563eb',
    dividerColor: '#bfdbfe',
    ctaStyle: { background: '#1e40af', color: '#fff' },
  },
  {
    id: 'standard',
    label: 'Service Standard',
    Icon: BookOpen,
    experience: '1 à 3 ans d\'expérience',
    schools: 'Bonne connaissance des programmes',
    qualites: [
      'Rigueur, discipline et communication',
      'Capacité à enseigner de manière interactive',
      'Évaluation régulière des progrès des élèves',
    ],
    responsabilites: [
      'Suivi régulier des élèves',
      'Préparation des cours',
      'Participation aux réunions parents',
    ],
    avantages: ['Rémunération attractive', 'Environnement stimulant', 'Développement professionnel'],
    accent: '#4f46e5',
    headerBg: '#f5f3ff',
    headerBorder: '#ddd6fe',
    cardBorder: '#ede9fe',
    iconBg: '#ede9fe',
    nameColor: '#1e1b4b',
    mutedColor: '#4338ca',
    textColor: '#374151',
    sectionLabelColor: '#6d28d9',
    dividerColor: '#ddd6fe',
    ctaStyle: { background: '#4338ca', color: '#fff' },
  },
  {
    id: 'social',
    label: 'Service Social',
    Icon: Heart,
    experience: 'Enseignants motivés',
    schools: 'Engagement social & pédagogique',
    qualites: [
      'Rigueur, discipline et sens du partage',
      'Bonne connaissance des programmes scolaires',
      'Capacité à enseigner en groupe',
    ],
    responsabilites: [
      'Suivi des élèves en groupe dans des centres',
      'Préparation des cours',
      'Participation aux réunions parents',
    ],
    avantages: ['Rémunération attractive', 'Environnement stimulant', 'Développement professionnel'],
    accent: '#15803d',
    headerBg: '#f0fdf4',
    headerBorder: '#bbf7d0',
    cardBorder: '#dcfce7',
    iconBg: '#dcfce7',
    nameColor: '#14532d',
    mutedColor: '#15803d',
    textColor: '#166534',
    sectionLabelColor: '#15803d',
    dividerColor: '#bbf7d0',
    ctaStyle: { background: '#15803d', color: '#fff' },
  },
];

/* ─── Component ─── */

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color }}>
      {label}
    </p>
  );
}

const PLAN_OPTIONS = [
  { id: 'elite',    label: 'Service Élite',    accent: '#b45309', bg: '#fffbeb', border: '#fde68a', check: '#b45309' },
  { id: 'premium',  label: 'Service Premium',  accent: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', check: '#1d4ed8' },
  { id: 'standard', label: 'Service Standard', accent: '#4f46e5', bg: '#f5f3ff', border: '#ddd6fe', check: '#4f46e5' },
  { id: 'social',   label: 'Service Social',   accent: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', check: '#15803d' },
] as const;

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function CarrieresForm() {
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fileName, setFileName]         = useState('');
  const [cvFile, setCvFile]             = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [planError, setPlanError]       = useState(false);
  const [apiError, setApiError]         = useState('');

  function handlePostuler(tierId: string) {
    setSelectedPlan(tierId);
    setPlanError(false);
    setTimeout(() => {
      document.getElementById('postuler')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedPlan) {
      setPlanError(true);
      document.getElementById('plan-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setApiError('');
    const form = e.currentTarget;
    const fd   = new FormData();
    fd.append('nom',               (form.elements.namedItem('nom')        as HTMLInputElement).value);
    fd.append('prenom',            (form.elements.namedItem('prenom')     as HTMLInputElement).value);
    fd.append('email',             (form.elements.namedItem('email')      as HTMLInputElement).value);
    fd.append('telephone',         (form.elements.namedItem('telephone')  as HTMLInputElement).value);
    fd.append('poste_vise',        (form.elements.namedItem('poste')      as HTMLSelectElement).value);
    fd.append('annees_experience', (form.elements.namedItem('experience') as HTMLSelectElement).value);
    fd.append('matieres',          (form.elements.namedItem('matieres')   as HTMLInputElement).value);
    fd.append('motivation',        (form.elements.namedItem('motivation') as HTMLTextAreaElement).value);
    fd.append('niveau_service',    selectedPlan);
    if (cvFile) fd.append('cv', cvFile);
    try {
      const res = await fetch(`${API}/api/candidatures`, { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? 'Erreur serveur');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-[72px]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-24">
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
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-5 px-3 py-1.5 rounded-full"
                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
              >
                Rejoignez-nous
              </span>
              <h1
                className="font-display font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}
              >
                Enseignez avec passion,{' '}
                <span style={{
                  background: 'linear-gradient(95deg, #1d4ed8 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  impactez des vies
                </span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-8">
                Rejoignez une équipe d&apos;enseignants passionnés dédiés à la réussite
                des élèves de Douala. Quatre niveaux de services, un seul objectif :
                l&apos;excellence pédagogique.
              </p>
              <div className="flex flex-wrap gap-4">
                {BENEFITS.slice(0, 3).map((b) => (
                  <span key={b} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="hidden lg:block rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.15)' }}
            >
              <Image
                src="/images/teacher-premium.jpg"
                alt="Enseignant PES"
                width={420}
                height={360}
                className="object-cover w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Recruitment tiers ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#f8faff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              className="inline-block text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Recrutement
            </motion.span>
            <motion.h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              Rejoignez notre équipe d&apos;enseignants
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
            >
              Nous recrutons des enseignants passionnés pour chaque niveau de service.
              Trouvez le profil qui correspond à votre parcours.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
            {TIERS.map((tier, i) => {
              const Icon = tier.Icon;
              return (
                <motion.div
                  key={tier.id}
                  className="relative rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    border: `1.5px solid ${tier.cardBorder}`,
                    boxShadow: tier.featured
                      ? '0 16px 48px rgba(180,83,9,0.18)'
                      : '0 2px 12px rgba(15,23,42,0.07)',
                    background: '#ffffff',
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.09, duration: 0.55 }}
                >
                  {/* Colored header */}
                  <div
                    className="px-5 py-4"
                    style={{ background: tier.headerBg, borderBottom: `1.5px solid ${tier.headerBorder}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: tier.iconBg, border: `1px solid ${tier.headerBorder}` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: tier.accent }} />
                        </div>
                        <h3 className="font-display font-bold text-sm" style={{ color: tier.nameColor }}>
                          {tier.label}
                        </h3>
                      </div>
                      {tier.featured && (
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                          style={{ background: tier.accent, color: '#fff' }}
                        >
                          Top
                        </span>
                      )}
                    </div>
                    {/* Experience badge */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock className="w-3 h-3 flex-shrink-0" style={{ color: tier.accent }} />
                      <span className="text-xs font-semibold" style={{ color: tier.accent }}>
                        {tier.experience}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    {/* Schools */}
                    <div className="flex items-start gap-1.5 pb-3"
                      style={{ borderBottom: `1px solid ${tier.dividerColor}` }}>
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tier.sectionLabelColor }} />
                      <p className="text-[12px] italic leading-snug" style={{ color: tier.mutedColor }}>
                        {tier.schools}
                      </p>
                    </div>

                    {/* Qualities */}
                    <div>
                      <SectionLabel label="Qualités requises" color={tier.sectionLabelColor} />
                      <ul className="space-y-1.5">
                        {tier.qualites.map((q) => (
                          <li key={q} className="flex items-start gap-2 text-[12px]">
                            <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tier.accent }} />
                            <span style={{ color: tier.textColor }}>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Responsibilities */}
                    <div className="pt-3" style={{ borderTop: `1px solid ${tier.dividerColor}` }}>
                      <SectionLabel label="Responsabilités" color={tier.sectionLabelColor} />
                      <ul className="space-y-1.5">
                        {tier.responsabilites.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-[12px]">
                            <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: tier.accent }} />
                            <span style={{ color: tier.textColor }}>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits pills */}
                    <div className="pt-3 mt-auto" style={{ borderTop: `1px solid ${tier.dividerColor}` }}>
                      <SectionLabel label="Avantages" color={tier.sectionLabelColor} />
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tier.avantages.map((a) => (
                          <span
                            key={a}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{
                              background: tier.headerBg,
                              color: tier.textColor,
                              border: `1px solid ${tier.headerBorder}`,
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePostuler(tier.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold
                                   transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                        style={tier.ctaStyle}
                      >
                        Postuler pour ce poste
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Application section ── */}
      <section id="postuler" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: benefits + profile */}
          <div className="space-y-5">
            {/* Benefits card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#f8faff', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.07)' }}
            >
              <h2 className="font-display font-bold text-lg text-slate-900 mb-4">
                Pourquoi nous rejoindre ?
              </h2>
              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Profile card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.12)' }}
            >
              <Image
                src="/images/tutoring-home.jpg"
                alt="Profil enseignant PES"
                width={400}
                height={220}
                className="object-cover w-full"
              />
              <div className="p-5" style={{ background: '#0c1a3a' }}>
                <h3 className="font-bold text-white text-base mb-2">Profil recherché</h3>
                <ul className="text-blue-200/70 text-sm space-y-1.5">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    Bac+3 minimum (Licence ou plus)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    Maîtrise de la matière enseignée
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    Passion pour la pédagogie
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    Ponctualité et sérieux
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                className="rounded-2xl p-12 text-center"
                style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                  Candidature envoyée !
                </h3>
                <p className="text-slate-500 text-base mb-4">
                  Nous examinerons votre dossier et vous recontacterons dans les 5 jours ouvrés.
                </p>
                {selectedPlan && (() => {
                  const plan = PLAN_OPTIONS.find(p => p.id === selectedPlan);
                  return plan ? (
                    <span
                      className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full"
                      style={{ background: plan.bg, color: plan.accent, border: `1.5px solid ${plan.border}` }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Postulé pour : {plan.label}
                    </span>
                  ) : null;
                })()}
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-5"
                style={{
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.08)',
                }}
              >
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900">
                    Formulaire de candidature
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.
                  </p>
                </div>

                {/* Plan selector — required */}
                <div id="plan-selector">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Niveau de service visé <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PLAN_OPTIONS.map((plan) => {
                      const active = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => { setSelectedPlan(plan.id); setPlanError(false); }}
                          className="relative flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl
                                     border-2 text-center transition-all duration-200 focus:outline-none
                                     hover:scale-[1.02]"
                          style={{
                            background:   active ? plan.bg   : '#f8faff',
                            borderColor:  active ? plan.accent : (planError ? '#fca5a5' : '#e2e8f0'),
                            boxShadow:    active
                              ? `0 4px 18px ${plan.accent}28, 0 0 0 3px ${plan.border}`
                              : 'none',
                          }}
                        >
                          {active && (
                            <span
                              className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ background: plan.accent }}
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                          <span
                            className="font-extrabold text-[12px] leading-tight"
                            style={{ color: active ? plan.accent : '#334155' }}
                          >
                            {plan.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {planError && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      Veuillez sélectionner un niveau de service avant de continuer.
                    </p>
                  )}
                  {/* Hidden input so the value travels with the form */}
                  <input type="hidden" name="niveau_service" value={selectedPlan} />
                </div>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'nom',       label: 'Nom *',       placeholder: 'Dupont'            },
                    { id: 'prenom',    label: 'Prénom *',    placeholder: 'Jean'              },
                    { id: 'email',     label: 'Email *',     placeholder: 'jean@email.cm', type: 'email' },
                    { id: 'telephone', label: 'Téléphone *', placeholder: '+237 6XX XXX XXX', type: 'tel' },
                  ].map(({ id, label, placeholder, type = 'text' }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
                        {label}
                      </label>
                      <input
                        id={id} name={id} type={type} placeholder={placeholder} required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                   placeholder:text-slate-300 focus:outline-none focus:ring-2
                                   focus:ring-blue-400 focus:border-transparent transition text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Poste + expérience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="poste" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Poste visé *
                    </label>
                    <select
                      id="poste" name="poste" required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                    >
                      <option value="">Sélectionner...</option>
                      {POSTES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Années d&apos;expérience *
                    </label>
                    <select
                      id="experience" name="experience" required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                    >
                      <option value="">Sélectionner...</option>
                      <option>Moins d&apos;1 an</option>
                      <option>1–3 ans</option>
                      <option>3–5 ans</option>
                      <option>5–10 ans</option>
                      <option>Plus de 10 ans</option>
                    </select>
                  </div>
                </div>

                {/* Matières */}
                <div>
                  <label htmlFor="matieres" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Matières enseignées *
                  </label>
                  <input
                    id="matieres" name="matieres" type="text"
                    placeholder="Ex: Mathématiques, Physique-Chimie" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                               placeholder:text-slate-300 focus:outline-none focus:ring-2
                               focus:ring-blue-400 text-sm"
                  />
                </div>

                {/* CV upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    CV (PDF) *
                  </label>
                  <label
                    className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed
                               border-slate-200 rounded-xl cursor-pointer hover:border-blue-300
                               hover:bg-blue-50/40 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-sm text-slate-500">
                      {fileName || 'Cliquez pour télécharger votre CV'}
                    </span>
                    <span className="text-xs text-slate-300 mt-0.5">PDF, max 5 MB</span>
                    <input
                      type="file" accept=".pdf" className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setCvFile(f);
                        setFileName(f?.name || '');
                      }}
                    />
                  </label>
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Lettre de motivation *
                  </label>
                  <textarea
                    id="motivation" name="motivation" rows={4} required
                    placeholder="Pourquoi voulez-vous rejoindre PES ? Qu'est-ce qui vous distingue en tant qu'enseignant ?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                               placeholder:text-slate-300 focus:outline-none focus:ring-2
                               focus:ring-blue-400 text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold
                             py-3.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                    boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
                  }}
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                </button>

                {apiError && (
                  <div className="text-sm px-4 py-3 rounded-xl"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    {apiError}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
