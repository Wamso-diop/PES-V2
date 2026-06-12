'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Clock, Calendar,
  FileText, Copy, Send, Check, ChevronDown, ExternalLink,
  GraduationCap, Star, User, CheckCircle2, XCircle, MessageSquare,
  Sparkles, Download,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Types ── */
interface Candidature {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  poste_vise: string; matieres: string; niveau_service?: string;
  annees_experience: string; motivation?: string;
  cv_url?: string; statut: string; created_at: string; matricule?: string;
}

/* ── Status config ── */
const STATUTS: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  nouveau:    { label: 'Nouveau',    color: '#1d4ed8', bg: '#eff6ff', icon: Sparkles      },
  en_etude:   { label: 'En étude',  color: '#b45309', bg: '#fef3c7', icon: Clock         },
  entretien:  { label: 'Entretien', color: '#c2410c', bg: '#fff7ed', icon: MessageSquare  },
  accepté:    { label: 'Accepté',   color: '#15803d', bg: '#f0fdf4', icon: CheckCircle2   },
  refusé:     { label: 'Refusé',    color: '#dc2626', bg: '#fef2f2', icon: XCircle        },
};

const STATUT_ORDER = ['nouveau', 'en_etude', 'entretien', 'accepté', 'refusé'];

/* ── Email templates ── */
function buildTemplate(type: 'accepté' | 'refusé' | 'entretien', c: Candidature) {
  const name = `${c.prenom} ${c.nom}`;
  const poste = c.poste_vise;
  const exp   = c.annees_experience;
  const mat   = c.matieres;

  const subjects = {
    accepté:   `Félicitations ! Votre candidature à PES a été retenue`,
    refusé:    `Réponse à votre candidature – PES Douala`,
    entretien: `Invitation à un entretien – PES Douala`,
  };

  const bodies = {
    accepté: `Cher(e) ${name},

Nous avons le plaisir de vous informer que votre candidature au poste de ${poste} au sein du Pôle d'Excellence Scolaire (PES) de Douala a été retenue.

Votre profil correspond parfaitement à nos attentes, notamment votre expérience de ${exp} et votre expertise en ${mat}.

Nous vous contacterons dans les prochains jours pour vous communiquer les modalités de votre intégration ainsi que les prochaines étapes.

Bienvenue dans l'équipe PES ! Nous sommes impatients de vous compter parmi nous.

Cordialement,
L'équipe Ressources Humaines
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm
+237 6XX XXX XXX`,

    refusé: `Cher(e) ${name},

Nous vous remercions de l'intérêt que vous portez au Pôle d'Excellence Scolaire et du temps consacré à votre candidature au poste de ${poste}.

Après examen attentif de votre dossier, nous avons le regret de vous informer que nous ne sommes pas en mesure de donner une suite favorable à votre candidature à ce jour. Cette décision ne remet pas en cause vos compétences, mais reflète simplement les besoins actuels de notre équipe.

Nous conserverons néanmoins votre dossier dans notre base de données et n'hésiterons pas à vous recontacter si une opportunité correspondant à votre profil se présente.

Nous vous souhaitons une pleine réussite dans vos démarches professionnelles.

Cordialement,
L'équipe Ressources Humaines
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm`,

    entretien: `Cher(e) ${name},

Nous avons bien reçu votre candidature au poste de ${poste} et nous avons le plaisir de vous informer que votre dossier a retenu notre attention.

Nous souhaiterions vous rencontrer afin d'échanger sur votre parcours, vos compétences en ${mat} et les modalités d'une éventuelle collaboration au sein de l'équipe PES.

Pourriez-vous nous faire part de vos disponibilités pour la semaine prochaine, afin que nous puissions convenir d'un créneau d'entretien qui vous convienne ?

L'entretien pourra se tenir en présentiel dans nos locaux à Douala ou en visioconférence, selon votre préférence.

Dans l'attente de vous rencontrer,

Cordialement,
L'équipe Ressources Humaines
Pôle d'Excellence Scolaire – Douala
contact@pes-douala.cm
+237 6XX XXX XXX`,
  };

  return { subject: subjects[type], body: bodies[type] };
}

/* ── Helper ── */
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
    ['#f59e0b', '#b45309'], ['#3b82f6', '#1d4ed8'], ['#8b5cf6', '#7c3aed'],
    ['#10b981', '#059669'], ['#ef4444', '#dc2626'], ['#f97316', '#ea580c'],
  ];
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
  return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

/* ═══════════════════════════════════════════════════════ */
export default function CandidatureDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;
  const locale   = (params?.locale as string) ?? 'fr';

  const [cand,      setCand]      = useState<Candidature | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [statOpen,  setStatOpen]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  const [tplTab,    setTplTab]    = useState<'accepté' | 'refusé' | 'entretien'>('accepté');
  const [copied,    setCopied]    = useState<'subject' | 'body' | null>(null);

  /* ── Fetch ── */
  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem('pes_token') ?? '';
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res   = await fetch(`${API}/api/candidatures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error('Introuvable');
      setCand(await res.json());
    } catch {
      setError('Impossible de charger la candidature.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  /* ── Status update ── */
  async function changeStatut(s: string) {
    if (!cand) return;
    setSaving(true);
    setStatOpen(false);
    try {
      const token = localStorage.getItem('pes_token') ?? '';
      const res   = await fetch(`${API}/api/candidatures/${cand.id}/statut?statut=${s}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCand(prev => prev ? { ...prev, statut: s } : prev);
    } finally {
      setSaving(false);
    }
  }

  /* ── Copy helper ── */
  function copyText(text: string, which: 'subject' | 'body') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
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

  if (error || !cand) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <XCircle className="w-12 h-12 text-red-300" />
      <p className="text-slate-500 font-semibold">{error || 'Candidature introuvable'}</p>
      <button onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
    </div>
  );

  const st      = STATUTS[cand.statut] ?? STATUTS.nouveau;
  const StIcon  = st.icon;
  const plan    = cand.niveau_service?.toLowerCase();
  const tpl     = buildTemplate(tplTab, cand);
  const initials = `${cand.prenom[0] ?? '?'}${cand.nom[0] ?? '?'}`.toUpperCase();

  const planColors: Record<string, { color: string; bg: string }> = {
    elite:    { color: '#b45309', bg: '#fef3c7' },
    premium:  { color: '#1d4ed8', bg: '#dbeafe' },
    standard: { color: '#7c3aed', bg: '#ede9fe' },
    social:   { color: '#15803d', bg: '#dcfce7' },
  };
  const planStyle = plan ? (planColors[plan] ?? { color: '#64748b', bg: '#f1f5f9' }) : null;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.push(`/${locale}/admin/gestion?tab=candidatures`)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux candidatures
        </button>

        {/* Status pill + dropdown */}
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
              {STATUT_ORDER.map(s => {
                const ss = STATUTS[s];
                const SIcon = ss.icon;
                return (
                  <button key={s} onClick={() => changeStatut(s)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    style={{ color: ss.color }}>
                    <SIcon className="w-4 h-4" />
                    {ss.label}
                    {cand.statut === s && <Check className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── HERO card ── */}
      <div className="rounded-3xl overflow-hidden"
        style={{ border: '1.5px solid #e8eef8', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>

        {/* Gradient banner */}
        <div className="h-28 relative"
          style={{ background: 'linear-gradient(135deg,#07111f 0%,#0c1a3a 40%,#1e3a8a 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)' }} />
          <div className="absolute top-3 right-5 flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ background: `${st.color}22`, color: st.color, border: `1px solid ${st.color}44` }}>
              <StIcon className="inline w-3 h-3 mr-1" />{st.label}
            </span>
            {planStyle && plan && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full capitalize"
                style={{ background: `${planStyle.color}22`, color: planStyle.color, border: `1px solid ${planStyle.color}44` }}>
                {plan}
              </span>
            )}
          </div>
        </div>

        {/* Avatar row */}
        <div className="bg-white px-8 pb-6 relative">
          <div className="flex items-end gap-5 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white flex-shrink-0 ring-4 ring-white"
              style={{ background: avatarGrad(cand.nom) }}>
              {initials}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {cand.prenom} {cand.nom}
                </h2>
                {cand.matricule && (
                  <span className="text-xs font-black tracking-widest px-3 py-1 rounded-full"
                    style={{ background: '#fffbeb', color: '#b45309', border: '1.5px solid #fde68a', fontFamily: 'ui-monospace, monospace' }}>
                    {cand.matricule}
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />{cand.poste_vise}
              </p>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${cand.email}`}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-xl">
              <Mail className="w-3.5 h-3.5" />{cand.email}
            </a>
            <a href={`tel:${cand.telephone}`}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors bg-slate-50 px-3 py-1.5 rounded-xl">
              <Phone className="w-3.5 h-3.5" />{cand.telephone}
            </a>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5" />Candidature reçue le {fmtShort(cand.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-6">

        {/* LEFT — Professional info */}
        <div className="space-y-5">

          {/* Info cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Clock,         label: 'Expérience',    value: cand.annees_experience, color: '#3b82f6' },
              { icon: GraduationCap, label: 'Poste visé',    value: cand.poste_vise,        color: '#8b5cf6' },
              { icon: Star,          label: 'Niveau service', value: plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : '—', color: '#f59e0b' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5"
                style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className="font-extrabold text-slate-800 text-base leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Matières */}
          <div className="bg-white rounded-2xl p-6"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              Matières enseignées
            </h3>
            <div className="flex flex-wrap gap-2">
              {cand.matieres.split(/[,;]/).map(m => m.trim()).filter(Boolean).map(m => (
                <span key={m}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', color: '#4338ca' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Motivation */}
          {cand.motivation && (
            <div className="bg-white rounded-2xl p-6"
              style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Lettre de motivation
              </h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)' }} />
                <p className="pl-5 text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {cand.motivation}
                </p>
              </div>
            </div>
          )}

          {/* CV */}
          {cand.cv_url && (
            <div className="bg-white rounded-2xl p-6"
              style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-green-500" />
                Curriculum Vitae
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>
                  <div className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      CV — {cand.prenom} {cand.nom}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">Document PDF</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={cand.cv_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Ouvrir
                  </a>
                  <a href={cand.cv_url} download
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-slate-100"
                    style={{ background: '#f1f5f9', color: '#475569' }}>
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Status timeline + Email templates */}
        <div className="space-y-5">

          {/* Status timeline */}
          <div className="bg-white rounded-2xl p-6"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-5 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              Progression du dossier
            </h3>
            <div className="space-y-1">
              {STATUT_ORDER.filter(s => s !== 'refusé').map((s, i, arr) => {
                const ss   = STATUTS[s];
                const SIcon = ss.icon;
                const idx  = STATUT_ORDER.indexOf(cand.statut);
                const cur  = STATUT_ORDER.indexOf(s);
                const done = idx >= cur && cand.statut !== 'refusé';
                const active = cand.statut === s;
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
                      <p className="text-sm font-bold leading-none"
                        style={{ color: active ? ss.color : done ? '#334155' : '#94a3b8' }}>
                        {ss.label}
                      </p>
                      {active && (
                        <p className="text-[11px] text-slate-400 mt-0.5">En cours</p>
                      )}
                    </div>
                    {active && (
                      <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ background: ss.color }} />
                    )}
                  </div>
                );
              })}
              {cand.statut === 'refusé' && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#fef2f2', border: '2px solid #dc2626' }}>
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-sm font-bold text-red-600">Candidature refusée</p>
                </div>
              )}
            </div>
          </div>

          {/* Email templates */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>

            {/* Header */}
            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4">
                <Mail className="w-4 h-4 text-blue-500" />
                Templates d'email
              </h3>

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f8faff' }}>
                {([
                  { key: 'accepté',   label: 'Accepté',   color: '#15803d' },
                  { key: 'entretien', label: 'Entretien', color: '#c2410c' },
                  { key: 'refusé',    label: 'Refusé',    color: '#dc2626' },
                ] as const).map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => setTplTab(key)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: tplTab === key ? '#fff' : 'transparent',
                      color:      tplTab === key ? color : '#94a3b8',
                      boxShadow:  tplTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template content */}
            <div className="px-6 py-5 space-y-4">

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Objet</p>
                  <button
                    onClick={() => copyText(tpl.subject, 'subject')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                    style={{ background: copied === 'subject' ? '#f0fdf4' : '#f8faff', color: copied === 'subject' ? '#15803d' : '#94a3b8' }}>
                    {copied === 'subject' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'subject' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700"
                  style={{ background: '#f8faff', border: '1.5px solid #e8eef8' }}>
                  {tpl.subject}
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Corps du message</p>
                  <button
                    onClick={() => copyText(tpl.body, 'body')}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                    style={{ background: copied === 'body' ? '#f0fdf4' : '#f8faff', color: copied === 'body' ? '#15803d' : '#94a3b8' }}>
                    {copied === 'body' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'body' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="px-4 py-4 rounded-xl text-xs text-slate-600 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto"
                  style={{ background: '#f8faff', border: '1.5px solid #e8eef8', fontFamily: 'ui-monospace, monospace' }}>
                  {tpl.body}
                </div>
              </div>

              {/* Send button */}
              <a
                href={`mailto:${cand.email}?subject=${encodeURIComponent(tpl.subject)}&body=${encodeURIComponent(tpl.body)}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: tplTab === 'accepté'   ? 'linear-gradient(135deg,#15803d,#059669)' :
                              tplTab === 'entretien' ? 'linear-gradient(135deg,#c2410c,#ea580c)' :
                                                      'linear-gradient(135deg,#dc2626,#b91c1c)',
                }}>
                <Send className="w-4 h-4" />
                Envoyer via messagerie
              </a>

              <p className="text-center text-[11px] text-slate-400">
                Ouvre votre client email avec le message pré-rempli
              </p>
            </div>
          </div>

          {/* Quick info card */}
          <div className="bg-white rounded-2xl p-5"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 mb-4 uppercase tracking-wider">
              <User className="w-4 h-4 text-slate-400" />
              Récapitulatif
            </h3>
            <dl className="space-y-3">
              {[
                cand.matricule ? { label: 'Matricule',     value: cand.matricule } : null,
                { label: 'Nom complet',    value: `${cand.prenom} ${cand.nom}` },
                { label: 'Email',          value: cand.email },
                { label: 'Téléphone',      value: cand.telephone },
                { label: 'Poste visé',     value: cand.poste_vise },
                { label: 'Expérience',     value: cand.annees_experience },
                { label: 'Date dépôt',     value: fmtDate(cand.created_at) },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0 w-28">{label}</dt>
                  <dd className="text-xs font-semibold text-slate-700 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
