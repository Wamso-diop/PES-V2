'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, MessageCircle,
  Send, CheckCircle2, Clock, ArrowRight,
  Check,
} from 'lucide-react';

const LEVELS = ['CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

const FORMULE_OPTIONS = [
  { id: 'elite',    label: 'Élite',    accent: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { id: 'premium',  label: 'Premium',  accent: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  { id: 'standard', label: 'Standard', accent: '#4f46e5', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'sociale',  label: 'Sociale',  accent: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  { id: 'unknown',  label: 'Je ne sais pas encore', accent: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
] as const;

const CONTACT_ITEMS = [
  {
    Icon: MapPin,
    label: 'Adresse',
    value: 'Bonanjo, Douala, Cameroun',
    href: undefined,
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  {
    Icon: Phone,
    label: 'Téléphone',
    value: '+237 690 041 633',
    href: 'tel:+237690041633',
    color: '#15803d',
    bg: '#f0fdf4',
  },
  {
    Icon: Mail,
    label: 'Email',
    value: 'contact@pes-douala.cm',
    href: 'mailto:contact@pes-douala.cm',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    Icon: Clock,
    label: 'Disponibilité',
    value: 'Lun – Sam · 8h00 – 20h00',
    href: undefined,
    color: '#b45309',
    bg: '#fffbeb',
  },
];

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function ContactForm() {
  const [submitted, setSubmitted]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [selectedFormule, setSelectedFormule] = useState('');
  const [formuleError, setFormuleError]       = useState(false);
  const [apiError, setApiError]               = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFormule) {
      setFormuleError(true);
      document.getElementById('formule-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setApiError('');
    const form = e.currentTarget;
    const body = {
      nom:              (form.elements.namedItem('nom')       as HTMLInputElement).value,
      prenom:           (form.elements.namedItem('prenom')    as HTMLInputElement).value,
      email:            (form.elements.namedItem('email')     as HTMLInputElement).value,
      telephone:        (form.elements.namedItem('telephone') as HTMLInputElement).value,
      niveau_eleve:     (form.elements.namedItem('niveau')    as HTMLSelectElement).value,
      classe_souhaitee: selectedFormule,
      message:          (form.elements.namedItem('message')   as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch(`${API}/api/inscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSubmitted(true);
    } catch {
      setApiError('Une erreur est survenue. Veuillez réessayer ou nous contacter par WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-[72px]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-24">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom right, black 30%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom right, black 30%, transparent 70%)',
            opacity: 0.45,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em]
                         px-4 py-1.5 rounded-full mb-6"
              style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
            >
              Bilan gratuit · Sans engagement
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-extrabold text-slate-900 leading-[1.07] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}
          >
            Commençons{' '}
            <span
              style={{
                background: 'linear-gradient(95deg, #1d4ed8 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ensemble
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
            className="mt-5 text-slate-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Remplissez ce formulaire pour réserver votre bilan pédagogique gratuit.
            Nous vous recontactons <strong className="text-slate-600 font-semibold">sous 24h</strong>.
          </motion.p>
        </div>
      </section>

      {/* ── Main section ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8" style={{ background: '#f8faff' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 -mt-4">

          {/* ── Left: contact info ── */}
          <div className="space-y-4">

            {/* Contact cards */}
            {CONTACT_ITEMS.map(({ Icon, label, value, href, color, bg }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-white rounded-2xl p-4"
                style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-slate-800 font-semibold text-sm hover:underline"
                      style={{ color: '#0f172a' }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-slate-800 font-semibold text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/237690041633?text=Bonjour%20PES%20!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 font-bold text-sm text-white
                         px-5 py-3.5 rounded-2xl transition-all duration-200 hover:opacity-90
                         hover:scale-[1.01]"
              style={{
                background: '#25D366',
                boxShadow: '0 6px 20px rgba(37,211,102,0.32)',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Écrire sur WhatsApp
              <ArrowRight className="w-4 h-4 ml-auto" />
            </a>

            {/* Response time badge */}
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: 'linear-gradient(160deg, #0c1a3a 0%, #1a2f6b 100%)',
                boxShadow: '0 8px 32px rgba(12,26,58,0.25)',
              }}
            >
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                Réponse garantie
              </p>
              <p className="text-white font-extrabold text-3xl mb-1">24h</p>
              <p className="text-blue-200/60 text-xs">
                Après réception de votre demande, un conseiller pédagogique vous contacte.
              </p>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div>
            {submitted ? (
              <motion.div
                className="rounded-3xl p-14 text-center h-full flex flex-col items-center justify-center"
                style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: '#dcfce7' }}
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 mb-3">
                  Demande reçue !
                </h3>
                <p className="text-slate-500 text-base max-w-sm">
                  Nous vous recontactons dans les{' '}
                  <strong className="text-slate-700">24 heures</strong>{' '}
                  pour planifier votre bilan pédagogique gratuit.
                </p>
                {selectedFormule && (() => {
                  const f = FORMULE_OPTIONS.find(o => o.id === selectedFormule);
                  return f ? (
                    <span
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full"
                      style={{ background: f.bg, color: f.accent, border: `1.5px solid ${f.border}` }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Formule sélectionnée : {f.label}
                    </span>
                  ) : null;
                })()}
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 lg:p-10 space-y-6 bg-white"
                style={{
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 8px 40px rgba(15,23,42,0.09)',
                }}
              >
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="font-display font-extrabold text-xl text-slate-900">
                    Formulaire d&apos;inscription
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Bilan pédagogique gratuit · Sans engagement · Réponse sous 24h
                  </p>
                </div>

                {/* Infos parent */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-3">
                    Informations du parent
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'nom',       label: 'Nom *',       placeholder: 'Dupont'            },
                      { id: 'prenom',    label: 'Prénom *',    placeholder: 'Marie'             },
                      { id: 'email',     label: 'Email *',     placeholder: 'marie@email.cm',   type: 'email' },
                      { id: 'telephone', label: 'Téléphone *', placeholder: '+237 6XX XXX XXX', type: 'tel'   },
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
                </div>

                {/* Niveau de l'élève */}
                <div>
                  <label htmlFor="niveau" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Niveau de l&apos;élève *
                  </label>
                  <select
                    id="niveau" name="niveau" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                               focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                  >
                    <option value="">Sélectionner un niveau...</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Formule souhaitée — visual card selector */}
                <div id="formule-selector">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Formule souhaitée <span className="text-red-400">*</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {FORMULE_OPTIONS.map((opt) => {
                      const active = selectedFormule === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setSelectedFormule(opt.id); setFormuleError(false); }}
                          className="relative flex flex-col items-center gap-1 py-3 px-2 rounded-2xl
                                     border-2 text-center transition-all duration-200 focus:outline-none
                                     hover:scale-[1.02]"
                          style={{
                            background:  active ? opt.bg    : '#f8fafc',
                            borderColor: active ? opt.accent : (formuleError ? '#fca5a5' : '#e2e8f0'),
                            boxShadow:   active
                              ? `0 4px 16px ${opt.accent}28, 0 0 0 3px ${opt.border}`
                              : 'none',
                          }}
                        >
                          {active && (
                            <span
                              className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full
                                         flex items-center justify-center"
                              style={{ background: opt.accent }}
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                          <span
                            className="font-bold text-[11px] leading-tight"
                            style={{ color: active ? opt.accent : '#475569' }}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {formuleError && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      Veuillez sélectionner une formule pour continuer.
                    </p>
                  )}
                  <input type="hidden" name="formule" value={selectedFormule} />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message <span className="text-slate-300">(optionnel)</span>
                  </label>
                  <textarea
                    id="message" name="message" rows={4}
                    placeholder="Décrivez les difficultés de votre enfant, les matières concernées, vos attentes..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                               placeholder:text-slate-300 focus:outline-none focus:ring-2
                               focus:ring-blue-400 text-sm resize-none"
                  />
                </div>

                {/* API error */}
                {apiError && (
                  <div className="text-sm px-4 py-3 rounded-xl"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    {apiError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 font-bold text-white
                             py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-[1.005]
                             disabled:opacity-60 text-base"
                  style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                    boxShadow: '0 6px 24px rgba(37,99,235,0.38)',
                  }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>

                <p className="text-center text-xs text-slate-300">
                  Bilan gratuit · Aucun engagement · Vos données sont confidentielles
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
