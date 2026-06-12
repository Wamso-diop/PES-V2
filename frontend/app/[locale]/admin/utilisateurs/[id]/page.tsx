'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, BookOpen, Calendar,
  MessageSquare, Copy, Send, Check, ChevronDown,
  CheckCircle2, XCircle, Clock, User, Sparkles,
  GraduationCap, Archive, RefreshCw,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Types ── */
interface Inscription {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  niveau_eleve: string; classe_souhaitee?: string; message?: string;
  statut: string; created_at: string; matricule?: string;
}

/* ── Status config ── */
const STATUTS: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  nouveau:   { label: 'Nouveau',   color: '#1d4ed8', bg: '#eff6ff', icon: Sparkles     },
  contacté:  { label: 'Contacté', color: '#0891b2', bg: '#ecfeff', icon: Phone         },
  converti:  { label: 'Converti', color: '#15803d', bg: '#f0fdf4', icon: CheckCircle2  },
  archivé:   { label: 'Archivé',  color: '#64748b', bg: '#f1f5f9', icon: Archive       },
};

const STATUT_ORDER = ['nouveau', 'contacté', 'converti'];

/* ── Email templates ── */
function buildEmailTemplate(type: 'bienvenue' | 'info' | 'relance', ins: Inscription) {
  const name  = `${ins.prenom} ${ins.nom}`;
  const level = ins.niveau_eleve;
  const classe = ins.classe_souhaitee ? ` en ${ins.classe_souhaitee}` : '';

  const subjects = {
    bienvenue: `Bienvenue chez PES – Votre demande de soutien scolaire`,
    info:      `Votre inscription au Pôle d'Excellence Scolaire – Prochaines étapes`,
    relance:   `Suivi de votre demande – PES Douala`,
  };

  const bodies = {
    bienvenue: `Cher(e) ${name},

Nous avons bien reçu votre demande de soutien scolaire pour votre enfant (niveau : ${level}${classe}) et nous vous en remercions chaleureusement.

Au Pôle d'Excellence Scolaire, nous mettons tout en œuvre pour offrir un accompagnement personnalisé et de qualité à chaque élève. Notre équipe d'enseignants qualifiés et passionnés sera ravie d'accompagner votre enfant vers la réussite.

Un membre de notre équipe vous contactera très prochainement pour :
• Finaliser l'inscription de votre enfant
• Convenir d'un planning de cours adapté
• Vous présenter nos formules et tarifs

En attendant, n'hésitez pas à nous contacter directement si vous avez des questions.

Cordialement,
L'équipe PES
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm
+237 6XX XXX XXX`,

    info: `Cher(e) ${name},

Suite à votre demande de soutien scolaire pour votre enfant (niveau : ${level}${classe}), nous vous informons que votre dossier est actuellement en cours de traitement.

Voici les prochaines étapes :

1. Évaluation du niveau de votre enfant
2. Attribution d'un enseignant spécialisé
3. Définition du planning de cours
4. Signature du contrat et démarrage des cours

Nous vous contacterons dans les 24 à 48 heures pour convenir d'un rendez-vous.

Pour toute question, vous pouvez nous joindre à tout moment via WhatsApp ou par email.

Cordialement,
L'équipe PES
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm
+237 6XX XXX XXX`,

    relance: `Cher(e) ${name},

Nous espérons que vous allez bien. Nous revenons vers vous concernant votre demande de soutien scolaire pour votre enfant en ${level}${classe}, effectuée il y a quelques jours.

Nous souhaiterions prendre contact avec vous afin de finaliser votre inscription et de vous présenter notre offre adaptée aux besoins de votre enfant.

Seriez-vous disponible pour un bref échange téléphonique cette semaine ?

Nous restons à votre disposition pour toute question.

Cordialement,
L'équipe PES
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm
+237 6XX XXX XXX`,
  };

  return { subject: subjects[type], body: bodies[type] };
}

/* ── WhatsApp templates ── */
function buildWhatsAppMessage(type: 'bienvenue' | 'relance' | 'rdv', ins: Inscription) {
  const name  = ins.prenom;
  const level = ins.niveau_eleve;

  const messages = {
    bienvenue: `Bonjour ${name} ! 👋

Nous avons bien reçu votre demande de soutien scolaire pour votre enfant (niveau *${level}*) au Pôle d'Excellence Scolaire.

Notre équipe va prendre contact avec vous très prochainement pour finaliser votre inscription. 🎓

En attendant, n'hésitez pas à nous poser vos questions ici.

— Équipe PES Douala`,

    relance: `Bonjour ${name} ! 👋

Nous revenons vers vous concernant votre demande d'inscription au PES pour votre enfant en *${level}*.

Êtes-vous toujours intéressé(e) ? Nous serions ravis de vous accompagner. 😊

— Équipe PES Douala`,

    rdv: `Bonjour ${name} ! 📅

Nous aimerions convenir d'un rendez-vous pour discuter du soutien scolaire de votre enfant (niveau *${level}*).

Quelles sont vos disponibilités cette semaine ?

— Équipe PES Douala`,
  };

  return messages[type];
}

/* ── Helpers ── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function avatarGrad(name: string) {
  const colors = [
    ['#3b82f6', '#1d4ed8'], ['#8b5cf6', '#7c3aed'], ['#10b981', '#059669'],
    ['#f59e0b', '#b45309'], ['#ef4444', '#dc2626'], ['#0891b2', '#0e7490'],
  ];
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
  return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}
function cleanPhone(phone: string) {
  return phone.replace(/\s+/g, '').replace(/^\+/, '').replace(/^00/, '');
}

/* ═══════════════════════════════════════════════════════ */
export default function InscriptionDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params?.id as string;
  const locale  = (params?.locale as string) ?? 'fr';

  const [ins,       setIns]       = useState<Inscription | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [statOpen,  setStatOpen]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  const [emailTab,  setEmailTab]  = useState<'bienvenue' | 'info' | 'relance'>('bienvenue');
  const [waTab,     setWaTab]     = useState<'bienvenue' | 'relance' | 'rdv'>('bienvenue');
  const [copied,    setCopied]    = useState<string | null>(null);

  /* ── Fetch ── */
  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem('pes_token') ?? '';
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res   = await fetch(`${API}/api/inscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error('Introuvable');
      setIns(await res.json());
    } catch {
      setError('Impossible de charger l\'inscription.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  /* ── Status update ── */
  async function changeStatut(s: string) {
    if (!ins) return;
    setSaving(true);
    setStatOpen(false);
    try {
      const token = localStorage.getItem('pes_token') ?? '';
      const res   = await fetch(`${API}/api/inscriptions/${ins.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: s }),
      });
      if (res.ok) setIns(prev => prev ? { ...prev, statut: s } : prev);
    } finally {
      setSaving(false);
    }
  }

  /* ── Copy ── */
  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Chargement…</p>
    </div>
  );

  if (error || !ins) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <XCircle className="w-12 h-12 text-red-300" />
      <p className="text-slate-500 font-semibold">{error || 'Inscription introuvable'}</p>
      <button onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
    </div>
  );

  const st     = STATUTS[ins.statut] ?? STATUTS.nouveau;
  const StIcon = st.icon;
  const initials = `${ins.prenom[0] ?? '?'}${ins.nom[0] ?? '?'}`.toUpperCase();
  const emailTpl = buildEmailTemplate(emailTab, ins);
  const waTpl    = buildWhatsAppMessage(waTab, ins);
  const waPhone  = cleanPhone(ins.telephone);
  const waLink   = `https://wa.me/${waPhone}?text=${encodeURIComponent(waTpl)}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.push(`/${locale}/admin/utilisateurs`)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux utilisateurs
        </button>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatOpen(o => !o)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-80"
            style={{ background: st.bg, color: st.color, border: `1.5px solid ${st.color}22` }}
          >
            <StIcon className="w-4 h-4" />
            {saving ? 'Enregistrement…' : st.label}
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          </button>
          {statOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 bg-white rounded-2xl shadow-2xl py-2 min-w-[180px]"
              style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              {Object.entries(STATUTS).map(([key, ss]) => {
                const SIcon = ss.icon;
                return (
                  <button key={key} onClick={() => changeStatut(key)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    style={{ color: ss.color }}>
                    <SIcon className="w-4 h-4" />
                    {ss.label}
                    {ins.statut === key && <Check className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="rounded-3xl overflow-hidden"
        style={{ border: '1.5px solid #e8eef8', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>
        <div className="h-28 relative"
          style={{ background: 'linear-gradient(135deg,#07111f 0%,#0c1a3a 40%,#1e3a8a 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#3b82f6 0%,transparent 60%),radial-gradient(circle at 80% 20%,#8b5cf6 0%,transparent 50%)' }} />
          <div className="absolute top-3 right-5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ background: `${st.color}22`, color: st.color, border: `1px solid ${st.color}44` }}>
              <StIcon className="inline w-3 h-3 mr-1" />{st.label}
            </span>
          </div>
        </div>
        <div className="bg-white px-8 pb-6 relative">
          <div className="flex items-end gap-5 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white flex-shrink-0 ring-4 ring-white"
              style={{ background: avatarGrad(ins.nom) }}>
              {initials}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{ins.prenom} {ins.nom}</h2>
                {ins.matricule && (
                  <span className="text-xs font-black tracking-widest px-3 py-1 rounded-full"
                    style={{ background: '#eff6ff', color: '#1d4ed8', border: '1.5px solid #bfdbfe', fontFamily: 'ui-monospace, monospace' }}>
                    {ins.matricule}
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />Parent · Élève niveau {ins.niveau_eleve}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${ins.email}`}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors">
              <Mail className="w-3.5 h-3.5" />{ins.email}
            </a>
            <a href={`tel:${ins.telephone}`}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl transition-colors">
              <Phone className="w-3.5 h-3.5" />{ins.telephone}
            </a>
            {/* WhatsApp quick-dial */}
            <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: '#25D366' }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5" />Inscrit le {fmtShort(ins.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMNS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-6">

        {/* LEFT */}
        <div className="space-y-5">

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: 'Niveau de l\'élève', value: ins.niveau_eleve,            color: '#3b82f6' },
              { icon: BookOpen,      label: 'Classe souhaitée',   value: ins.classe_souhaitee || '—',  color: '#8b5cf6' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5"
                style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className="font-extrabold text-slate-800 text-base">{value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          {ins.message && (
            <div className="bg-white rounded-2xl p-6"
              style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Message du parent
              </h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)' }} />
                <p className="pl-5 text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{ins.message}</p>
              </div>
            </div>
          )}

          {/* Récapitulatif */}
          <div className="bg-white rounded-2xl p-5"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
              <User className="w-4 h-4 text-slate-400" />
              Récapitulatif
            </h3>
            <dl className="space-y-3">
              {(
                [
                  ins.matricule ? { label: 'Matricule',       value: ins.matricule } : null,
                  { label: 'Nom complet',      value: `${ins.prenom} ${ins.nom}` },
                  { label: 'Email',            value: ins.email },
                  { label: 'Téléphone',        value: ins.telephone },
                  { label: 'Niveau élève',     value: ins.niveau_eleve },
                  { label: 'Classe souhaitée', value: ins.classe_souhaitee || 'Non précisée' },
                  { label: 'Date inscription', value: fmtDate(ins.created_at) },
                ] as { label: string; value: string }[]
              ).filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0 w-32">{label}</dt>
                  <dd className="text-xs font-semibold text-slate-700 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* Status timeline */}
          <div className="bg-white rounded-2xl p-6"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-5 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              Progression du dossier
            </h3>
            <div className="space-y-1">
              {STATUT_ORDER.map((s, i, arr) => {
                const ss    = STATUTS[s];
                const SIcon = ss.icon;
                const steps = ['nouveau', 'contacté', 'converti'];
                const idx   = steps.indexOf(ins.statut);
                const cur   = steps.indexOf(s);
                const done  = idx >= cur && ins.statut !== 'archivé';
                const active = ins.statut === s;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: active ? ss.color : done ? `${ss.color}22` : '#f1f5f9',
                          border: `2px solid ${active ? ss.color : done ? ss.color : '#e2e8f0'}`,
                        }}>
                        <SIcon className="w-4 h-4" style={{ color: active ? '#fff' : done ? ss.color : '#cbd5e1' }} />
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-0.5 h-5 mt-1"
                          style={{ background: done && !active ? ss.color : '#e2e8f0' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="text-sm font-bold"
                        style={{ color: active ? ss.color : done ? '#334155' : '#94a3b8' }}>
                        {ss.label}
                      </p>
                      {active && <p className="text-[11px] text-slate-400 mt-0.5">Statut actuel</p>}
                    </div>
                    {active && (
                      <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ background: ss.color }} />
                    )}
                  </div>
                );
              })}
              {ins.statut === 'archivé' && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#f1f5f9', border: '2px solid #94a3b8' }}>
                    <Archive className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Dossier archivé</p>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp templates */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Messages WhatsApp
              </h3>
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f8faff' }}>
                {([
                  { key: 'bienvenue', label: 'Bienvenue' },
                  { key: 'rdv',       label: 'Rendez-vous' },
                  { key: 'relance',   label: 'Relance' },
                ] as const).map(({ key, label }) => (
                  <button key={key} onClick={() => setWaTab(key)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: waTab === key ? '#fff' : 'transparent',
                      color:      waTab === key ? '#25D366' : '#94a3b8',
                      boxShadow:  waTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Message</p>
                  <button onClick={() => copyText(waTpl, 'wa')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                    style={{ background: copied === 'wa' ? '#f0fdf4' : '#f8faff', color: copied === 'wa' ? '#15803d' : '#94a3b8' }}>
                    {copied === 'wa' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'wa' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="px-4 py-4 rounded-xl text-xs text-slate-600 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto"
                  style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', fontFamily: 'ui-monospace, monospace' }}>
                  {waTpl}
                </div>
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Ouvrir dans WhatsApp
              </a>
              <p className="text-center text-[11px] text-slate-400">Ouvre WhatsApp avec le message pré-rempli</p>
            </div>
          </div>

          {/* Email templates */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4">
                <Mail className="w-4 h-4 text-blue-500" />
                Templates Email
              </h3>
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f8faff' }}>
                {([
                  { key: 'bienvenue', label: 'Bienvenue', color: '#15803d' },
                  { key: 'info',      label: 'Info',      color: '#1d4ed8' },
                  { key: 'relance',   label: 'Relance',   color: '#c2410c' },
                ] as const).map(({ key, label, color }) => (
                  <button key={key} onClick={() => setEmailTab(key)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: emailTab === key ? '#fff' : 'transparent',
                      color:      emailTab === key ? color : '#94a3b8',
                      boxShadow:  emailTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Objet</p>
                  <button onClick={() => copyText(emailTpl.subject, 'subj')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                    style={{ background: copied === 'subj' ? '#f0fdf4' : '#f8faff', color: copied === 'subj' ? '#15803d' : '#94a3b8' }}>
                    {copied === 'subj' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'subj' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700"
                  style={{ background: '#f8faff', border: '1.5px solid #e8eef8' }}>
                  {emailTpl.subject}
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Corps</p>
                  <button onClick={() => copyText(emailTpl.body, 'body')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                    style={{ background: copied === 'body' ? '#f0fdf4' : '#f8faff', color: copied === 'body' ? '#15803d' : '#94a3b8' }}>
                    {copied === 'body' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'body' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="px-4 py-4 rounded-xl text-xs text-slate-600 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto"
                  style={{ background: '#f8faff', border: '1.5px solid #e8eef8', fontFamily: 'ui-monospace, monospace' }}>
                  {emailTpl.body}
                </div>
              </div>

              <a href={`mailto:${ins.email}?subject=${encodeURIComponent(emailTpl.subject)}&body=${encodeURIComponent(emailTpl.body)}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                <Send className="w-4 h-4" />
                Envoyer via messagerie
              </a>
              <p className="text-center text-[11px] text-slate-400">Ouvre votre client email avec le message pré-rempli</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
