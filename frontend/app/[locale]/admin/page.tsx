'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, FileText, BookOpen, TrendingUp, Clock,
  ArrowRight, UserPlus, CheckCircle2, XCircle,
  AlertCircle, BarChart2, Zap,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Inscription {
  id: string; nom: string; prenom: string; email: string;
  niveau_eleve: string; classe_souhaitee?: string;
  statut: string; created_at: string;
}
interface Candidature {
  id: string; nom: string; prenom: string; email: string;
  poste_vise: string; niveau_service?: string;
  statut: string; created_at: string;
}
interface Article { id: string; titre_fr: string; statut: string; created_at: string; }

const BADGE: Record<string, { bg: string; color: string; label: string }> = {
  nouveau:   { bg: '#eff6ff', color: '#1d4ed8', label: 'Nouveau'   },
  contacté:  { bg: '#f0fdf4', color: '#15803d', label: 'Contacté'  },
  converti:  { bg: '#ecfdf5', color: '#059669', label: 'Converti'  },
  archivé:   { bg: '#f1f5f9', color: '#64748b', label: 'Archivé'   },
  en_etude:  { bg: '#fef3c7', color: '#b45309', label: 'En étude'  },
  entretien: { bg: '#fff7ed', color: '#c2410c', label: 'Entretien' },
  accepté:   { bg: '#f0fdf4', color: '#15803d', label: 'Accepté'   },
  refusé:    { bg: '#fef2f2', color: '#dc2626', label: 'Refusé'    },
  brouillon: { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon' },
  publié:    { bg: '#f0fdf4', color: '#15803d', label: 'Publié'    },
};

function Badge({ statut }: { statut: string }) {
  const s = BADGE[statut] ?? { bg: '#f1f5f9', color: '#64748b', label: statut };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function Avatar({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
      style={{ background: gradient }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const router   = useRouter();
  const locale   = pathname.split('/')[1] || 'fr';

  const [inscriptions,  setInscriptions]  = useState<Inscription[]>([]);
  const [candidatures,  setCandidatures]  = useState<Candidature[]>([]);
  const [articles,      setArticles]      = useState<Article[]>([]);
  const [loaded,        setLoaded]        = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pes_token');
    if (!token) { router.replace(`/${locale}/admin/login`); return; }
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/inscriptions`,      { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/candidatures`,      { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/articles/admin/all`,{ headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([i, c, a]) => {
      setInscriptions(Array.isArray(i) ? i : []);
      setCandidatures(Array.isArray(c) ? c : []);
      setArticles(Array.isArray(a) ? a : []);
      setLoaded(true);
    });
  }, [locale, router]);

  const totalI    = inscriptions.length;
  const totalC    = candidatures.length;
  const publiés   = articles.filter(a => a.statut === 'publié').length;
  const converted = inscriptions.filter(i => i.statut === 'converti').length;
  const convRate  = totalI > 0 ? Math.round((converted / totalI) * 100) : 0;
  const newI      = inscriptions.filter(i => i.statut === 'nouveau').length;
  const newC      = candidatures.filter(c => c.statut === 'nouveau').length;
  const GOAL      = 200;
  const pct       = Math.min(100, Math.round((totalI / GOAL) * 100));

  const KPI = [
    {
      label: 'Inscriptions', value: totalI, sub: `+${newI} en attente`,
      Icon: Users, grad: 'linear-gradient(135deg,#1e40af,#2563eb)',
      light: '#eff6ff', text: '#1d4ed8',
    },
    {
      label: 'Candidatures', value: totalC, sub: `+${newC} nouvelles`,
      Icon: UserPlus, grad: 'linear-gradient(135deg,#5b21b6,#7c3aed)',
      light: '#f5f3ff', text: '#7c3aed',
    },
    {
      label: 'Articles publiés', value: publiés, sub: `${articles.length} au total`,
      Icon: BookOpen, grad: 'linear-gradient(135deg,#065f46,#059669)',
      light: '#ecfdf5', text: '#059669',
    },
    {
      label: 'Taux de conversion', value: `${convRate}%`, sub: `${converted} convertis`,
      Icon: TrendingUp, grad: 'linear-gradient(135deg,#0e7490,#0891b2)',
      light: '#ecfeff', text: '#0891b2',
    },
  ];

  if (!loaded) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Chargement du tableau de bord...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">

      {/* ══ HERO CARD ══ */}
      <div className="rounded-3xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #312e81 75%, #4c1d95 100%)', minHeight: 200 }}>

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 left-1/3 w-52 h-52 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />

        <div className="relative p-7 lg:p-9">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live · Tableau de bord
                </span>
              </div>
              <h2 className="text-white font-extrabold text-3xl lg:text-4xl leading-tight">
                PES Douala
              </h2>
              <p className="mt-1" style={{ color: 'rgba(165,180,252,0.6)', fontSize: 14 }}>
                Année scolaire 2025–2026 · Trimestre 2
              </p>
            </div>

            {/* KPI pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { v: totalI,    l: 'Inscriptions',  c: '#93c5fd' },
                { v: totalC,    l: 'Candidatures',   c: '#c4b5fd' },
                { v: publiés,   l: 'Articles',       c: '#6ee7b7' },
                { v: `${convRate}%`, l: 'Conversion', c: '#67e8f9' },
              ].map(({ v, l, c }) => (
                <div key={l} className="text-center px-5 py-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p className="font-extrabold text-2xl leading-none" style={{ color: c }}>{v}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(165,180,252,0.55)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-7">
            <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(165,180,252,0.5)' }}>
              <span className="font-semibold">Objectif d'inscriptions — Trimestre 2</span>
              <span className="font-bold" style={{ color: '#a5b4fc' }}>{totalI} / {GOAL}</span>
            </div>
            <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-2.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%)',
                  boxShadow: '0 0 12px rgba(139,92,246,0.5)',
                }} />
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: 'rgba(165,180,252,0.4)' }}>
              {pct}% atteint · {GOAL - totalI > 0 ? `${GOAL - totalI} inscriptions restantes` : 'Objectif atteint !'}
            </p>
          </div>
        </div>
      </div>

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI.map(({ label, value, sub, Icon, grad, light, text }) => (
          <div key={label} className="bg-white rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>

            {/* Accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: grad }} />

            <div className="flex items-start justify-between mb-4 mt-1">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: light }}>
                <Icon className="w-5 h-5" style={{ color: text }} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: light, color: text }}>
                ↑
              </span>
            </div>

            <p className="font-extrabold text-3xl text-slate-900 leading-none">{value}</p>
            <p className="text-slate-500 text-xs font-medium mt-1">{label}</p>
            <p className="text-xs font-semibold mt-2" style={{ color: text }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ══ ACTIVITY GRID ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Inscriptions */}
        <div className="bg-white rounded-2xl flex flex-col"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#eff6ff' }}>
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Dernières inscriptions</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{totalI} au total · {newI} en attente</p>
              </div>
            </div>
            <Link href={`/${locale}/admin/utilisateurs`}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-50"
              style={{ color: '#1d4ed8' }}>
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1">
            {inscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm font-medium">Aucune inscription</p>
                <p className="text-slate-300 text-xs mt-1">Les inscriptions apparaîtront ici</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50/80">
                {inscriptions.slice(0, 6).map(ins => (
                  <div key={ins.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                    <Avatar name={`${ins.nom[0]}${ins.prenom[0]}`} gradient="linear-gradient(135deg,#3b82f6,#6d28d9)" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-semibold truncate">{ins.prenom} {ins.nom}</p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">
                        {ins.niveau_eleve}{ins.classe_souhaitee ? ` · ${ins.classe_souhaitee}` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <Badge statut={ins.statut} />
                      <p className="text-slate-300 text-[10px]">{fmt(ins.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Candidatures */}
        <div className="bg-white rounded-2xl flex flex-col"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#f5f3ff' }}>
                <UserPlus className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Dernières candidatures</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{totalC} au total · {newC} à traiter</p>
              </div>
            </div>
            <Link href={`/${locale}/admin/gestion`}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-violet-50"
              style={{ color: '#7c3aed' }}>
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1">
            {candidatures.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserPlus className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm font-medium">Aucune candidature</p>
                <p className="text-slate-300 text-xs mt-1">Les candidatures apparaîtront ici</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50/80">
                {candidatures.slice(0, 6).map(c => (
                  <div key={c.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                    <Avatar name={`${c.nom[0]}${c.prenom[0]}`} gradient="linear-gradient(135deg,#d97706,#7c3aed)" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-semibold truncate">{c.prenom} {c.nom}</p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{c.poste_vise}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <Badge statut={c.statut} />
                      <p className="text-slate-300 text-[10px]">{fmt(c.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM ROW ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent articles */}
        <div className="bg-white rounded-2xl"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Articles récents</h3>
            </div>
            <Link href={`/${locale}/admin/gestion`}
              className="text-xs font-bold" style={{ color: '#059669' }}>
              Gérer
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {articles.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8">Aucun article</p>
            ) : articles.slice(0, 4).map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <p className="text-slate-700 text-xs font-medium truncate flex-1">{a.titre_fr}</p>
                <Badge statut={a.statut} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#ecfeff' }}>
                <BarChart2 className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Statistiques rapides</h3>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                label: 'Taux de conversion',
                value: convRate,
                max: 100,
                color: '#0891b2',
                bg: '#ecfeff',
                display: `${convRate}%`,
              },
              {
                label: 'Inscriptions traitées',
                value: inscriptions.filter(i => i.statut !== 'nouveau').length,
                max: totalI || 1,
                color: '#1d4ed8',
                bg: '#eff6ff',
                display: `${inscriptions.filter(i => i.statut !== 'nouveau').length}/${totalI}`,
              },
              {
                label: 'Candidatures en cours',
                value: candidatures.filter(c => ['en_etude','entretien'].includes(c.statut)).length,
                max: totalC || 1,
                color: '#7c3aed',
                bg: '#f5f3ff',
                display: `${candidatures.filter(c => ['en_etude','entretien'].includes(c.statut)).length}`,
              },
              {
                label: 'Articles publiés',
                value: publiés,
                max: articles.length || 1,
                color: '#059669',
                bg: '#ecfdf5',
                display: `${publiés}/${articles.length}`,
              },
            ].map(({ label, value, max, color, bg, display }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="font-bold" style={{ color }}>{display}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: bg }}>
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.round((value / max) * 100))}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7' }}>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Actions rapides</h3>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: 'Voir les inscriptions',  href: `/${locale}/admin/utilisateurs`, color: '#1d4ed8', bg: '#eff6ff', Icon: Users     },
              { label: 'Gérer les candidatures', href: `/${locale}/admin/gestion`,      color: '#7c3aed', bg: '#f5f3ff', Icon: UserPlus  },
              { label: 'Nouvel article',          href: `/${locale}/admin/gestion`,      color: '#059669', bg: '#f0fdf4', Icon: BookOpen  },
              { label: 'Voir les statistiques',  href: `/${locale}/admin/stats`,        color: '#0891b2', bg: '#ecfeff', Icon: BarChart2 },
            ].map(({ label, href, color, bg, Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                           transition-all hover:scale-[1.01] hover:shadow-sm"
                style={{ background: bg, color }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
