'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Gem, BookOpen, Heart, Check, ArrowRight, ArrowLeft,
  User, Mail, Phone, GraduationCap, MessageSquare, ChevronDown,
  Sparkles, Shield, Clock, Star,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Plans data ── */
const PLANS = [
  {
    id: 'elite',
    name: 'Élite',
    tagline: 'Pour viser le sommet',
    price: 'Sur devis',
    priceNote: 'Accompagnement premium',
    Icon: Trophy,
    color: '#b45309',
    colorLight: '#fef3c7',
    colorBorder: '#fde68a',
    grad: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    gradDark: 'linear-gradient(135deg, #b45309, #d97706)',
    featured: false,
    features: [
      'Sessions quotidiennes (6j/7)',
      'Enseignant dédié exclusif',
      'Suivi personnalisé 24/7',
      'Préparation intensive BEPC/BAC',
      'Coaching motivation & bien-être',
      'Rapports hebdomadaires parents',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'La formule la plus choisie',
    price: 'Formule vedette',
    priceNote: 'Meilleur rapport qualité',
    Icon: Gem,
    color: '#60a5fa',
    colorLight: 'rgba(96,165,250,0.15)',
    colorBorder: 'rgba(96,165,250,0.3)',
    grad: 'linear-gradient(160deg, #07111f 0%, #1e3a8a 100%)',
    gradDark: 'linear-gradient(135deg, #f59e0b, #d97706)',
    featured: true,
    features: [
      '4 séances par semaine',
      'Enseignant attitré',
      'Suivi de progression détaillé',
      'Devoirs & exercices corrigés',
      'Bilan mensuel avec les parents',
      'Assistance WhatsApp réactive',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: "L'essentiel pour progresser",
    price: 'Accessible',
    priceNote: 'Formule de base complète',
    Icon: BookOpen,
    color: '#4f46e5',
    colorLight: '#eef2ff',
    colorBorder: '#c7d2fe',
    grad: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
    gradDark: 'linear-gradient(135deg, #3730a3, #4f46e5)',
    featured: false,
    features: [
      '2 séances par semaine',
      'Exercices ciblés sur les lacunes',
      'Suivi régulier de la progression',
      'Accès aux ressources de base',
      'Bilan trimestriel',
      'Communication avec les parents',
    ],
  },
  {
    id: 'social',
    name: 'Social',
    tagline: "L'excellence pour tous",
    price: 'Tarif solidaire',
    priceNote: 'Adapté à vos ressources',
    Icon: Heart,
    color: '#15803d',
    colorLight: '#f0fdf4',
    colorBorder: '#bbf7d0',
    grad: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    gradDark: 'linear-gradient(135deg, #15803d, #16a34a)',
    featured: false,
    features: [
      'Tarif adapté aux ressources',
      'Même exigence de qualité',
      'Enseignants qualifiés',
      'Suivi personnalisé',
      'Accompagnement complet',
      'Dossier de demande simplifié',
    ],
  },
] as const;

const NIVEAUX = [
  '— Primaire —', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
  '— Collège —', '6ème', '5ème', '4ème', '3ème',
  '— Lycée —', '2nde', '1ère A', '1ère C', '1ère D', 'Tle A', 'Tle C', 'Tle D',
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

/* ════════════════════════════════════════════════════════════ */
export default function InscriptionSteps() {
  const locale = useLocale();

  const [step,    setStep]    = useState<1 | 2 | 3>(1);
  const [plan,    setPlan]    = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    niveau_eleve: '', classe_souhaitee: '', message: '',
  });

  function setField(k: keyof typeof form, v: string) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function selectPlan(id: string) {
    setPlan(id);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.telephone || !form.niveau_eleve) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/inscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          classe_souhaitee: form.classe_souhaitee || undefined,
          message: form.message || undefined,
          niveau_service: plan ?? undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? 'Erreur serveur');
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  const selectedPlan = PLANS.find(p => p.id === plan);

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '72px' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #07111f 0%, #0c1a3a 60%, #1e3a8a 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#3b82f6 0%,transparent 60%), radial-gradient(circle at 80% 20%,#8b5cf6 0%,transparent 50%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(#ffffff11 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: step >= s ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.12)',
                    color: step >= s ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: `2px solid ${step >= s ? '#f59e0b' : 'rgba(255,255,255,0.15)'}`,
                  }}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="text-xs font-semibold hidden sm:block"
                  style={{ color: step >= s ? 'rgba(253,230,138,0.9)' : 'rgba(255,255,255,0.35)' }}>
                  {s === 1 ? 'Choisir votre formule' : 'Vos informations'}
                </span>
                {s < 2 && <div className="w-8 h-px mx-1" style={{ background: step > s ? '#f59e0b' : 'rgba(255,255,255,0.15)' }} />}
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(253,230,138,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              {step === 1 ? 'Inscription en ligne' : step === 2 ? 'Finaliser votre inscription' : 'Inscription confirmée'}
            </span>

            {step === 1 && (
              <>
                <h1 className="font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>
                  Choisissez votre<br />
                  <span style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    formule d'accompagnement
                  </span>
                </h1>
                <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(191,219,254,0.75)' }}>
                  Sélectionnez la formule adaptée aux besoins de votre enfant. Chaque formule garantit un suivi de qualité par nos enseignants qualifiés.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>
                  Complétez votre inscription
                </h1>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(191,219,254,0.75)' }}>
                  Formule choisie :
                  {selectedPlan && (
                    <span className="ml-2 font-bold px-3 py-0.5 rounded-full text-sm"
                      style={{ background: `${selectedPlan.color}33`, color: selectedPlan.color, border: `1px solid ${selectedPlan.color}44` }}>
                      {selectedPlan.name}
                    </span>
                  )}
                </p>
              </>
            )}
            {step === 3 && (
              <h1 className="font-extrabold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>
                Inscription réussie ! 🎉
              </h1>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── STEP 1 : Plans ── */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section key="step1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {PLANS.map((p, i) => {
                const Icon = p.Icon;
                const isDark = p.id === 'premium';
                return (
                  <motion.div key={p.id}
                    custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="relative rounded-3xl overflow-hidden cursor-pointer group"
                    style={{
                      background: p.grad,
                      border: `2px solid ${p.colorBorder}`,
                      boxShadow: p.featured ? `0 20px 60px ${p.color}22` : '0 4px 20px rgba(0,0,0,0.05)',
                    }}
                    onClick={() => selectPlan(p.id)}>

                    {/* Popular badge */}
                    {p.featured && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-b-2xl"
                          style={{ background: 'linear-gradient(90deg,#f59e0b,#d97706)', color: '#07111f' }}>
                          ⭐ Plus populaire
                        </span>
                      </div>
                    )}

                    <div className={`p-7 ${p.featured ? 'pt-12' : ''}`}>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: p.colorLight, border: `1.5px solid ${p.colorBorder}` }}>
                        <Icon className="w-7 h-7" style={{ color: p.color }} />
                      </div>

                      {/* Name */}
                      <h3 className="font-black text-2xl mb-1" style={{ color: isDark ? '#fff' : '#0f172a' }}>
                        {p.name}
                      </h3>
                      <p className="text-sm font-semibold mb-1" style={{ color: p.color }}>
                        {p.tagline}
                      </p>
                      <p className="text-xs mb-6" style={{ color: isDark ? 'rgba(191,219,254,0.5)' : '#94a3b8' }}>
                        {p.priceNote}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2.5 mb-8">
                        {p.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-sm"
                            style={{ color: isDark ? 'rgba(219,234,254,0.85)' : '#374151' }}>
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: `${p.color}22`, border: `1px solid ${p.color}44` }}>
                              <Check className="w-2.5 h-2.5" style={{ color: p.color }} />
                            </div>
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <button
                        className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02]"
                        style={{
                          background: p.gradDark,
                          color: p.id === 'standard' || p.id === 'social' ? '#fff' : p.id === 'elite' ? '#fff' : '#07111f',
                          boxShadow: `0 4px 16px ${p.color}30`,
                        }}>
                        Choisir {p.name}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: 'Enseignants certifiés',   sub: 'Tous nos profs sont vérifiés' },
                { icon: Star,   label: 'Satisfaction 98%',        sub: 'Avis de nos familles' },
                { icon: Clock,  label: 'Démarrage rapide',        sub: 'Sous 48h après inscription' },
                { icon: Check,  label: 'Sans engagement',         sub: 'Résiliable à tout moment' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: '#f8faff', border: '1.5px solid #e8eef8' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#eff6ff' }}>
                    <Icon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── STEP 2 : Form ── */}
        {step === 2 && (
          <motion.section key="step2"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto px-4 sm:px-6 py-16">

            {/* Change plan */}
            <button onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Changer de formule
            </button>

            <form onSubmit={submit} className="space-y-5">

              {/* Plan summary card */}
              {selectedPlan && (
                <div className="rounded-2xl p-5 flex items-center gap-4 mb-2"
                  style={{ background: selectedPlan.id === 'premium' ? 'linear-gradient(135deg,#07111f,#1e3a8a)' : selectedPlan.grad, border: `1.5px solid ${selectedPlan.colorBorder}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: selectedPlan.colorLight, border: `1.5px solid ${selectedPlan.colorBorder}` }}>
                    <selectedPlan.Icon className="w-6 h-6" style={{ color: selectedPlan.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-base" style={{ color: selectedPlan.id === 'premium' ? '#fff' : '#0f172a' }}>
                      Formule {selectedPlan.name}
                    </p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: selectedPlan.id === 'premium' ? 'rgba(191,219,254,0.7)' : '#64748b' }}>
                      {selectedPlan.tagline}
                    </p>
                  </div>
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: selectedPlan.color }} />
                </div>
              )}

              {/* Section: Coordonnées */}
              <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
                <h2 className="font-extrabold text-slate-800 text-base mb-5 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-blue-500" />
                  Vos coordonnées
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Prénom */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Prénom <span className="text-red-500">*</span></label>
                    <input
                      value={form.prenom} onChange={e => setField('prenom', e.target.value)}
                      placeholder="Jean"
                      className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#fafbff' }}
                      required />
                  </div>
                  {/* Nom */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nom <span className="text-red-500">*</span></label>
                    <input
                      value={form.nom} onChange={e => setField('nom', e.target.value)}
                      placeholder="Dupont"
                      className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#fafbff' }}
                      required />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email" value={form.email} onChange={e => setField('email', e.target.value)}
                      placeholder="jean.dupont@email.com"
                      className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#fafbff' }}
                      required />
                  </div>
                  {/* Téléphone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" value={form.telephone} onChange={e => setField('telephone', e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#fafbff' }}
                      required />
                  </div>
                </div>
              </div>

              {/* Section: Élève */}
              <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
                <h2 className="font-extrabold text-slate-800 text-base mb-5 flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-purple-500" />
                  Informations sur l'élève
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Niveau élève */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Niveau de l'élève <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={form.niveau_eleve} onChange={e => setField('niveau_eleve', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none"
                        style={{ borderColor: '#e2e8f0', background: '#fafbff' }}
                        required>
                        <option value="">Sélectionner le niveau</option>
                        {NIVEAUX.map(n =>
                          n.startsWith('—') ? (
                            <option key={n} disabled style={{ fontWeight: 'bold', color: '#94a3b8' }}>{n}</option>
                          ) : (
                            <option key={n} value={n}>{n}</option>
                          )
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Classe souhaitée */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Matière(s) prioritaire(s)</label>
                    <input
                      value={form.classe_souhaitee} onChange={e => setField('classe_souhaitee', e.target.value)}
                      placeholder="Ex: Maths, Physique, Français…"
                      className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      style={{ borderColor: '#e2e8f0', background: '#fafbff' }} />
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Besoins spécifiques ou questions
                  </label>
                  <textarea
                    value={form.message} onChange={e => setField('message', e.target.value)}
                    placeholder="Parlez-nous des difficultés de votre enfant, de ses objectifs, de vos disponibilités…"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                    style={{ borderColor: '#e2e8f0', background: '#fafbff' }} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
                  style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626' }}>
                  <span className="font-bold flex-shrink-0">⚠</span>
                  {error}
                </div>
              )}

              {/* Privacy note */}
              <p className="text-center text-xs text-slate-400 px-4">
                En soumettant ce formulaire, vous acceptez que PES vous contacte concernant votre demande.
                Vos données ne seront jamais partagées avec des tiers.
              </p>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.35)',
                }}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Confirmer mon inscription
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.section>
        )}

        {/* ── STEP 3 : Success ── */}
        {step === 3 && (
          <motion.section key="step3"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">

            {/* Checkmark animation */}
            <div className="relative mx-auto mb-8 w-28 h-28">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }} />
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', boxShadow: '0 16px 48px rgba(22,163,74,0.35)' }}>
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="font-black text-3xl text-slate-900 mb-3">
              Demande envoyée !
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-3">
              Nous avons bien reçu votre inscription.
            </p>
            {selectedPlan && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold"
                style={{ background: `${selectedPlan.color}15`, color: selectedPlan.color, border: `1.5px solid ${selectedPlan.color}30` }}>
                <selectedPlan.Icon className="w-4 h-4" />
                Formule {selectedPlan.name} sélectionnée
              </div>
            )}
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Un membre de notre équipe vous contactera sous <strong className="text-slate-700">48 heures</strong> pour finaliser votre inscription et planifier les premières séances.
            </p>

            {/* WhatsApp CTA */}
            <div className="space-y-3">
              <a href="https://wa.me/237690041633?text=Bonjour%20PES%20!%20Je%20viens%20de%20m'inscrire%20en%20ligne."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Nous contacter sur WhatsApp
              </a>
              <Link href={`/${locale}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                style={{ background: '#f1f5f9' }}>
                Retour à l'accueil
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
