'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, ChevronDown, Check, Plus, X, Users, UserPlus,
  Clock, Filter, Trash2, Tag, Eye,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Types ── */
interface Inscription {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  niveau_eleve: string; classe_souhaitee?: string; message?: string;
  statut: string; created_at: string; matricule?: string;
}
interface Candidature {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  poste_vise: string; annees_experience: string; matieres: string;
  niveau_service?: string; statut: string; created_at: string; matricule?: string;
}
type Row = {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  role: 'Parent' | 'Enseignant';
  sub: string; extra: string; plan?: string; matricule?: string;
  statut: string; created_at: string;
  raw: Inscription | Candidature;
};
interface CustomFilter {
  id: string; name: string; color: string; emoji: string;
  criteria: { type: CriteriaType; value: string }[];
}
type CriteriaType = 'role' | 'statut' | 'plan' | 'niveau';

/* ── Constants ── */
const STATUT_INSCRIP = ['nouveau', 'contacté', 'converti', 'archivé'];
const STATUT_CANDID  = ['nouveau', 'en_etude', 'entretien', 'accepté', 'refusé'];
const PLANS          = ['elite', 'premium', 'standard', 'social'];
const FILTER_COLORS  = [
  { value: '#1d4ed8', label: 'Bleu'    },
  { value: '#7c3aed', label: 'Violet'  },
  { value: '#059669', label: 'Vert'    },
  { value: '#b45309', label: 'Orange'  },
  { value: '#dc2626', label: 'Rouge'   },
  { value: '#db2777', label: 'Rose'    },
  { value: '#0891b2', label: 'Cyan'    },
  { value: '#4338ca', label: 'Indigo'  },
];
const FILTER_EMOJIS = ['🎯','⭐','🔥','💼','📌','🏆','✅','💡','🎓','👥'];

const CRITERIA_TYPES: { type: CriteriaType; label: string }[] = [
  { type: 'role',   label: 'Rôle'        },
  { type: 'statut', label: 'Statut'      },
  { type: 'plan',   label: 'Abonnement'  },
  { type: 'niveau', label: 'Niveau'      },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  nouveau:   { bg: '#eff6ff', color: '#1d4ed8', label: 'Nouveau'    },
  contacté:  { bg: '#ecfdf5', color: '#15803d', label: 'Contacté'   },
  converti:  { bg: '#f0fdf4', color: '#059669', label: 'Converti'   },
  archivé:   { bg: '#f1f5f9', color: '#64748b', label: 'Archivé'    },
  en_etude:  { bg: '#fef3c7', color: '#b45309', label: 'En étude'   },
  entretien: { bg: '#fff7ed', color: '#c2410c', label: 'Entretien'  },
  accepté:   { bg: '#f0fdf4', color: '#15803d', label: 'Accepté'    },
  refusé:    { bg: '#fef2f2', color: '#dc2626', label: 'Refusé'     },
};
const PLAN_STYLE: Record<string, { bg: string; color: string }> = {
  elite:    { bg: '#fef3c7', color: '#b45309' },
  premium:  { bg: '#eff6ff', color: '#1d4ed8' },
  standard: { bg: '#f5f3ff', color: '#7c3aed' },
  social:   { bg: '#f0fdf4', color: '#15803d' },
};

function Badge({ statut }: { statut: string }) {
  const s = STATUS_STYLE[statut] ?? { bg: '#f1f5f9', color: '#64748b', label: statut };
  return (
    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}
function PlanBadge({ plan }: { plan: string }) {
  const s = PLAN_STYLE[plan.toLowerCase()] ?? { bg: '#f1f5f9', color: '#64748b' };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
      style={{ background: s.bg, color: s.color }}>{plan}</span>
  );
}
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
}

/* ── Filter matching ── */
function matchRow(row: Row, criteria: CustomFilter['criteria']): boolean {
  return criteria.every(c => {
    if (c.type === 'role')   return row.role === c.value;
    if (c.type === 'statut') return row.statut === c.value;
    if (c.type === 'plan') {
      if (row.role !== 'Enseignant') return false;
      return (row.raw as Candidature).niveau_service?.toLowerCase() === c.value.toLowerCase();
    }
    if (c.type === 'niveau') {
      if (row.role !== 'Parent') return false;
      return (row.raw as Inscription).niveau_eleve?.toLowerCase().includes(c.value.toLowerCase()) ?? false;
    }
    return true;
  });
}

const EMPTY_NEW = {
  name: '', color: '#1d4ed8', emoji: '🎯',
  criteria: [{ type: 'role' as CriteriaType, value: 'Parent' }],
};

export default function UtilisateursPage() {
  const pathname = usePathname();
  const router   = useRouter();
  const locale   = pathname.split('/')[1] || 'fr';

  const [inscriptions,   setInscriptions]   = useState<Inscription[]>([]);
  const [candidatures,   setCandidatures]   = useState<Candidature[]>([]);
  const [loaded,         setLoaded]         = useState(false);
  const [activeFilter,   setActiveFilter]   = useState('tous');
  const [search,         setSearch]         = useState('');
  const [actionRow,      setActionRow]      = useState<string | null>(null);
  const [customFilters,  setCustomFilters]  = useState<CustomFilter[]>([]);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [newFilter,      setNewFilter]      = useState({ ...EMPTY_NEW });

  /* Load data + custom filters */
  useEffect(() => {
    const token = localStorage.getItem('pes_token');
    if (!token) { router.replace(`/${locale}/admin/login`); return; }
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/inscriptions`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/candidatures`, { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([i, c]) => {
      setInscriptions(Array.isArray(i) ? i : []);
      setCandidatures(Array.isArray(c) ? c : []);
      setLoaded(true);
    });
    try {
      const saved = JSON.parse(localStorage.getItem('pes_custom_filters') || '[]');
      setCustomFilters(Array.isArray(saved) ? saved : []);
    } catch { /* ignore */ }
  }, [locale, router]);

  /* Merge into rows */
  const allRows = useMemo<Row[]>(() => {
    const parents: Row[] = inscriptions.map(i => ({
      id: i.id, nom: i.nom, prenom: i.prenom, email: i.email, telephone: i.telephone,
      role: 'Parent',
      sub: i.niveau_eleve, extra: i.classe_souhaitee || '—',
      matricule: i.matricule,
      statut: i.statut, created_at: i.created_at, raw: i,
    }));
    const enseignants: Row[] = candidatures.map(c => ({
      id: c.id, nom: c.nom, prenom: c.prenom, email: c.email, telephone: c.telephone,
      role: 'Enseignant',
      sub: c.poste_vise, extra: c.annees_experience,
      plan: c.niveau_service, matricule: c.matricule,
      statut: c.statut, created_at: c.created_at, raw: c,
    }));
    return [...parents, ...enseignants].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [inscriptions, candidatures]);

  /* Apply active filter */
  const filtered = useMemo(() => {
    let rows = allRows;
    if (activeFilter === 'parents')     rows = rows.filter(r => r.role === 'Parent');
    else if (activeFilter === 'enseignants') rows = rows.filter(r => r.role === 'Enseignant');
    else if (activeFilter === 'attente') rows = rows.filter(r => r.statut === 'nouveau');
    else {
      const cf = customFilters.find(f => f.id === activeFilter);
      if (cf) rows = rows.filter(r => matchRow(r, cf.criteria));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.nom.toLowerCase().includes(q) ||
        r.prenom.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.matricule?.toLowerCase().includes(q) ?? false)
      );
    }
    return rows;
  }, [allRows, activeFilter, search, customFilters]);

  const counts = {
    tous:        allRows.length,
    parents:     allRows.filter(r => r.role === 'Parent').length,
    enseignants: allRows.filter(r => r.role === 'Enseignant').length,
    attente:     allRows.filter(r => r.statut === 'nouveau').length,
  };

  /* Status change */
  async function changeStatut(row: Row, newStatut: string) {
    const token = localStorage.getItem('pes_token');
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    if (row.role === 'Parent') {
      await fetch(`${API}/api/inscriptions/${row.id}`, {
        method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut }),
      });
      setInscriptions(prev => prev.map(i => i.id === row.id ? { ...i, statut: newStatut } : i));
    } else {
      await fetch(`${API}/api/candidatures/${row.id}/statut?statut=${encodeURIComponent(newStatut)}`, {
        method: 'PATCH', headers: h,
      });
      setCandidatures(prev => prev.map(c => c.id === row.id ? { ...c, statut: newStatut } : c));
    }
    setActionRow(null);
  }

  /* Custom filter CRUD */
  function saveFilter() {
    if (!newFilter.name.trim() || newFilter.criteria.length === 0) return;
    const filter: CustomFilter = {
      id: `cf_${Date.now()}`,
      name: newFilter.name.trim(),
      color: newFilter.color,
      emoji: newFilter.emoji,
      criteria: newFilter.criteria,
    };
    const updated = [...customFilters, filter];
    setCustomFilters(updated);
    localStorage.setItem('pes_custom_filters', JSON.stringify(updated));
    setActiveFilter(filter.id);
    setModalOpen(false);
    setNewFilter({ ...EMPTY_NEW });
  }

  function deleteFilter(id: string) {
    const updated = customFilters.filter(f => f.id !== id);
    setCustomFilters(updated);
    localStorage.setItem('pes_custom_filters', JSON.stringify(updated));
    if (activeFilter === id) setActiveFilter('tous');
  }

  function addCriteria() {
    setNewFilter(p => ({ ...p, criteria: [...p.criteria, { type: 'statut', value: 'nouveau' }] }));
  }
  function removeCriteria(i: number) {
    setNewFilter(p => ({ ...p, criteria: p.criteria.filter((_, idx) => idx !== i) }));
  }
  function updateCriteria(i: number, field: 'type' | 'value', val: string) {
    setNewFilter(p => ({
      ...p,
      criteria: p.criteria.map((c, idx) =>
        idx === i
          ? field === 'type'
            ? { type: val as CriteriaType, value: defaultValue(val as CriteriaType) }
            : { ...c, value: val }
          : c
      ),
    }));
  }
  function defaultValue(type: CriteriaType) {
    if (type === 'role')   return 'Parent';
    if (type === 'statut') return 'nouveau';
    if (type === 'plan')   return 'elite';
    return '';
  }
  function valuesForType(type: CriteriaType): string[] {
    if (type === 'role')   return ['Parent', 'Enseignant'];
    if (type === 'statut') return [...STATUT_INSCRIP, ...STATUT_CANDID.filter(s => !STATUT_INSCRIP.includes(s))];
    if (type === 'plan')   return PLANS;
    return [];
  }

  /* active filter meta */
  const activeCustom = customFilters.find(f => f.id === activeFilter);

  const inputCls = `w-full px-3 py-2 rounded-lg text-sm border border-slate-200 bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-slate-800`;

  return (
    <div className="w-full space-y-5">

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total utilisateurs', value: allRows.length,   Icon: Users,    grad: 'linear-gradient(135deg,#1e40af,#2563eb)', light: '#eff6ff', text: '#1d4ed8' },
          { label: 'Parents inscrits',   value: counts.parents,   Icon: Users,    grad: 'linear-gradient(135deg,#5b21b6,#7c3aed)', light: '#f5f3ff', text: '#7c3aed' },
          { label: 'Enseignants',        value: counts.enseignants,Icon: UserPlus, grad: 'linear-gradient(135deg,#c2410c,#ea580c)', light: '#fff7ed', text: '#c2410c' },
          { label: 'En attente',         value: counts.attente,   Icon: Clock,    grad: 'linear-gradient(135deg,#b45309,#d97706)', light: '#fffbeb', text: '#b45309' },
        ].map(({ label, value, Icon, grad, light, text }) => (
          <div key={label} className="bg-white rounded-2xl p-5 relative overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: grad }} />
            <div className="flex items-start justify-between mt-1 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: light }}>
                <Icon className="w-5 h-5" style={{ color: text }} />
              </div>
            </div>
            <p className="font-extrabold text-3xl text-slate-900 leading-none">{value}</p>
            <p className="text-slate-400 text-xs font-medium mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ══ SEARCH + FILTERS ══ */}
      <div className="bg-white rounded-2xl p-4"
        style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>

        {/* Search row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                         text-slate-800 placeholder:text-slate-300 text-sm focus:outline-none
                         focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all" />
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white
                       transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#1e40af,#3b29cc)', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }}>
            <Plus className="w-4 h-4" />
            Créer un filtre
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1 flex-shrink-0">
            <Filter className="w-3 h-3 inline mr-1" />Filtres
          </p>

          {/* Preset */}
          {[
            { id: 'tous',         label: 'Tous',         count: counts.tous         },
            { id: 'parents',      label: 'Parents',       count: counts.parents      },
            { id: 'enseignants',  label: 'Enseignants',   count: counts.enseignants  },
            { id: 'attente',      label: 'En attente',    count: counts.attente      },
          ].map(({ id, label, count }) => {
            const active = activeFilter === id;
            return (
              <button key={id} onClick={() => setActiveFilter(id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: active ? '#0f172a' : '#f8faff',
                  color:      active ? '#fff'    : '#64748b',
                  border:     active ? '1.5px solid #0f172a' : '1.5px solid #e2e8f0',
                }}>
                {label}
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                    color: active ? '#fff' : '#64748b',
                  }}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Separator */}
          {customFilters.length > 0 && (
            <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
          )}

          {/* Custom filters */}
          {customFilters.map(cf => {
            const active = activeFilter === cf.id;
            const matchCount = allRows.filter(r => matchRow(r, cf.criteria)).length;
            return (
              <div key={cf.id} className="inline-flex items-center gap-0.5">
                <button onClick={() => setActiveFilter(cf.id)}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-l-full text-xs font-bold transition-all"
                  style={{
                    background: active ? cf.color : `${cf.color}12`,
                    color:      active ? '#fff'   : cf.color,
                    border:     `1.5px solid ${active ? cf.color : `${cf.color}40`}`,
                    borderRight: 'none',
                  }}>
                  <span>{cf.emoji}</span>
                  {cf.name}
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? 'rgba(255,255,255,0.2)' : `${cf.color}20`,
                      color: active ? '#fff' : cf.color,
                    }}>
                    {matchCount}
                  </span>
                </button>
                <button onClick={() => deleteFilter(cf.id)}
                  className="flex items-center justify-center w-7 py-1.5 rounded-r-full transition-all hover:bg-red-50"
                  style={{
                    background: active ? cf.color : `${cf.color}12`,
                    color:      active ? 'rgba(255,255,255,0.7)' : `${cf.color}80`,
                    border:     `1.5px solid ${active ? cf.color : `${cf.color}40`}`,
                    borderLeft: 'none',
                  }}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Active filter description */}
        {activeCustom && (
          <div className="mt-3 flex items-center gap-2 text-xs"
            style={{ color: activeCustom.color }}>
            <Tag className="w-3.5 h-3.5" />
            <span className="font-semibold">Filtre actif :</span>
            {activeCustom.criteria.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full font-bold"
                style={{ background: `${activeCustom.color}12` }}>
                {c.type === 'plan' ? `Abonnement ${c.value}` :
                 c.type === 'role' ? c.value :
                 c.type === 'statut' ? STATUS_STYLE[c.value]?.label ?? c.value :
                 `Niveau : ${c.value}`}
              </span>
            )).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, <span key={`sep${i}`} className="opacity-40">+</span>, el], [])}
          </div>
        )}
      </div>

      {/* ══ TABLE ══ */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>

        {/* Table header meta */}
        <div className="px-6 py-3.5 flex items-center justify-between"
          style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
          <p className="text-xs font-bold text-slate-500">
            {filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}{search ? ` pour "${search}"` : ''}
          </p>
        </div>

        {!loaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>
              <Users className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-semibold">Aucun utilisateur trouvé</p>
            <p className="text-slate-400 text-xs mt-1">Modifiez votre filtre ou votre recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Utilisateur', 'Contact', 'Rôle / Plan', 'Détail', 'Statut', 'Date', '', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id}
                    className="transition-colors hover:bg-blue-50/30 group"
                    style={{ borderBottom: '1px solid #f8faff' }}>

                    {/* Avatar + name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ring-2 ring-white"
                          style={{
                            background: row.role === 'Parent'
                              ? 'linear-gradient(135deg,#3b82f6,#6d28d9)'
                              : 'linear-gradient(135deg,#f59e0b,#b45309)',
                          }}>
                          {row.nom[0]}{row.prenom[0]}
                        </div>
                        <div>
                          <p className="text-slate-800 text-sm font-bold leading-none">{row.prenom} {row.nom}</p>
                          {row.matricule ? (
                            <span className="inline-flex items-center text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded mt-0.5"
                              style={{
                                background: row.role === 'Parent' ? '#eff6ff' : '#fffbeb',
                                color: row.role === 'Parent' ? '#1d4ed8' : '#b45309',
                                fontFamily: 'ui-monospace, monospace',
                              }}>
                              {row.matricule}
                            </span>
                          ) : (
                            <p className="text-slate-400 text-[11px] mt-0.5">{row.sub}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="text-slate-600 text-xs font-medium">{row.email}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{row.telephone}</p>
                    </td>

                    {/* Role + Plan */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit"
                          style={row.role === 'Parent'
                            ? { background: '#eff6ff', color: '#1d4ed8' }
                            : { background: '#fff7ed', color: '#b45309' }}>
                          {row.role}
                        </span>
                        {row.plan && row.plan !== '' && (
                          <PlanBadge plan={row.plan} />
                        )}
                      </div>
                    </td>

                    {/* Detail */}
                    <td className="px-5 py-4 text-slate-400 text-xs max-w-[140px] truncate">
                      {row.extra}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4"><Badge statut={row.statut} /></td>

                    {/* Date */}
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{fmt(row.created_at)}</td>

                    {/* Voir détail */}
                    <td className="px-5 py-4">
                      <Link
                        href={
                          row.role === 'Parent'
                            ? `/${locale}/admin/utilisateurs/${row.id}`
                            : `/${locale}/admin/gestion/candidatures/${row.id}`
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </Link>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 relative">
                      <button onClick={() => setActionRow(actionRow === row.id ? null : row.id)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg
                                   border transition-all"
                        style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                        Statut <ChevronDown className="w-3 h-3" />
                      </button>
                      {actionRow === row.id && (
                        <div className="absolute right-5 top-full mt-1 z-30 bg-white rounded-xl shadow-xl py-1.5 min-w-[150px]"
                          style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                          {(row.role === 'Parent' ? STATUT_INSCRIP : STATUT_CANDID).map(s => {
                            const st = STATUS_STYLE[s] ?? { label: s, color: '#64748b', bg: '#f1f5f9' };
                            return (
                              <button key={s} onClick={() => changeStatut(row, s)}
                                className="w-full text-left px-4 py-2 text-xs font-semibold flex items-center
                                           justify-between hover:bg-slate-50 transition-colors"
                                style={{ color: st.color }}>
                                {st.label}
                                {row.statut === s && <Check className="w-3 h-3" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ FILTER CREATION MODAL ══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            style={{ border: '1.5px solid #e2e8f0' }}>

            {/* Modal header */}
            <div className="px-6 py-5 flex items-center justify-between"
              style={{ borderBottom: '1.5px solid #f1f5f9', background: '#fafbff' }}>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Créer un filtre personnalisé</h2>
                <p className="text-slate-400 text-xs mt-0.5">Définissez vos critères pour filtrer les utilisateurs</p>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nom du filtre *</label>
                <input className={inputCls} placeholder="Ex: Abonnement Elite, Nouveaux parents..."
                  value={newFilter.name}
                  onChange={e => setNewFilter(p => ({ ...p, name: e.target.value }))} />
              </div>

              {/* Emoji + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Emoji</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_EMOJIS.map(e => (
                      <button key={e} onClick={() => setNewFilter(p => ({ ...p, emoji: e }))}
                        className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
                        style={{
                          background: newFilter.emoji === e ? '#eff6ff' : '#f8faff',
                          border: `1.5px solid ${newFilter.emoji === e ? '#93c5fd' : '#e2e8f0'}`,
                        }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Couleur</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_COLORS.map(c => (
                      <button key={c.value} onClick={() => setNewFilter(p => ({ ...p, color: c.value }))}
                        title={c.label}
                        className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                        style={{
                          background: c.value,
                          border: `3px solid ${newFilter.color === c.value ? '#fff' : c.value}`,
                          boxShadow: newFilter.color === c.value ? `0 0 0 3px ${c.value}` : 'none',
                        }}>
                        {newFilter.color === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              {newFilter.name && (
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aperçu :</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${newFilter.color}12`, color: newFilter.color, border: `1.5px solid ${newFilter.color}40` }}>
                    {newFilter.emoji} {newFilter.name}
                  </span>
                </div>
              )}

              {/* Criteria */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Critères de filtre</label>
                  <button onClick={addCriteria}
                    className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg"
                    style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {newFilter.criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background: '#f8faff', border: '1px solid #e8eef8' }}>
                      <div className="text-[10px] font-bold text-slate-400 w-4 text-center">{i > 0 ? 'ET' : 'SI'}</div>

                      <select value={c.type} onChange={e => updateCriteria(i, 'type', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none focus:border-blue-400">
                        {CRITERIA_TYPES.map(ct => (
                          <option key={ct.type} value={ct.type}>{ct.label}</option>
                        ))}
                      </select>

                      <span className="text-slate-400 text-xs font-bold">=</span>

                      {c.type === 'niveau' ? (
                        <input value={c.value} onChange={e => updateCriteria(i, 'value', e.target.value)}
                          placeholder="Ex: Terminale, CM2..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400" />
                      ) : (
                        <select value={c.value} onChange={e => updateCriteria(i, 'value', e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none focus:border-blue-400">
                          {valuesForType(c.type).map(v => (
                            <option key={v} value={v}>{STATUS_STYLE[v]?.label ?? v.charAt(0).toUpperCase() + v.slice(1)}</option>
                          ))}
                        </select>
                      )}

                      {newFilter.criteria.length > 1 && (
                        <button onClick={() => removeCriteria(i)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3"
              style={{ borderTop: '1.5px solid #f1f5f9', background: '#fafbff' }}>
              <button onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                Annuler
              </button>
              <button onClick={saveFilter}
                disabled={!newFilter.name.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white
                           transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${newFilter.color}, ${newFilter.color}dd)`, boxShadow: `0 4px 14px ${newFilter.color}40` }}>
                <Check className="w-4 h-4" />
                Créer le filtre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
