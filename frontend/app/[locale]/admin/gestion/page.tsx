'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trash2, ExternalLink, Eye, ChevronDown, Check,
  BookOpen, Users, Plus, X, Youtube, Music, Image as ImageIcon,
  Edit2, Upload, AlertCircle, FileText, CheckCircle2, Archive,
  Clock, Calendar, UserCheck, AlertTriangle,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Types ── */
interface Article {
  id: string; titre_fr: string; slug: string; excerpt_fr?: string;
  contenu_fr?: string; auteur: string; categorie: string; statut: string;
  published_at?: string; created_at: string;
  youtube_url?: string; audio_url?: string; cover_image_url?: string;
  reading_time?: number;
}
interface Candidature {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  poste_vise: string; matieres: string;
  niveau_service?: string; annees_experience: string;
  cv_url?: string; statut: string; created_at: string; matricule?: string;
}
interface ArticleForm {
  titre_fr: string; slug: string; categorie: string; auteur: string;
  excerpt_fr: string; contenu_fr: string;
  youtube_url: string; audio_url: string;
  reading_time: number; statut: 'brouillon' | 'publié';
}

const EMPTY_FORM: ArticleForm = {
  titre_fr: '', slug: '', categorie: '', auteur: 'PES',
  excerpt_fr: '', contenu_fr: '',
  youtube_url: '', audio_url: '',
  reading_time: 5, statut: 'brouillon',
};

const PREDEFINED_CATEGORIES = [
  'Éducation', 'Mathématiques', 'Examens', 'Conseils aux parents',
  'Anglais', 'Bien-être', 'Actualités', 'Sciences', 'Concours', 'Français',
];

const ART_STATUTS  = ['brouillon', 'publié', 'archivé'];
const CAND_STATUTS = ['nouveau', 'en_etude', 'entretien', 'accepté', 'refusé'];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  brouillon:  { bg: '#f1f5f9', color: '#64748b', label: 'Brouillon'  },
  publié:     { bg: '#f0fdf4', color: '#15803d', label: 'Publié'     },
  archivé:    { bg: '#fef2f2', color: '#dc2626', label: 'Archivé'    },
  nouveau:    { bg: '#eff6ff', color: '#1d4ed8', label: 'Nouveau'    },
  en_etude:   { bg: '#fef3c7', color: '#b45309', label: 'En étude'   },
  entretien:  { bg: '#fff7ed', color: '#c2410c', label: 'Entretien'  },
  accepté:    { bg: '#f0fdf4', color: '#15803d', label: 'Accepté'    },
  refusé:     { bg: '#fef2f2', color: '#dc2626', label: 'Refusé'     },
};

const PLAN_COLORS: Record<string, string> = {
  elite: '#b45309', premium: '#1d4ed8', standard: '#7c3aed', social: '#15803d',
};

function Badge({ statut }: { statut: string }) {
  const s = STATUS_STYLE[statut] ?? { bg: '#f1f5f9', color: '#64748b', label: statut };
  return (
    <span className="inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function slugify(str: string) {
  return str.toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-800 outline-none transition-all
  border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 placeholder:text-slate-300`;

/* ── Mini stat card ── */
function MiniStat({
  label, value, Icon, color, bg, grad,
}: {
  label: string; value: number; Icon: React.ElementType;
  color: string; bg: string; grad: string;
}) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 relative overflow-hidden flex items-center gap-4"
      style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: grad }} />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: bg }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="font-extrabold text-2xl text-slate-900 leading-none">{value}</p>
        <p className="text-slate-400 text-[11px] font-medium mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

export default function GestionPage() {
  const pathname      = usePathname();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const locale        = pathname.split('/')[1] || 'fr';
  const fileRef       = useRef<HTMLInputElement>(null);

  const [tab,          setTab]          = useState<'blog' | 'carrieres'>(
    searchParams?.get('tab') === 'candidatures' ? 'carrieres' : 'blog'
  );
  const [articles,     setArticles]     = useState<Article[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [artFilter,    setArtFilter]    = useState('tous');
  const [candFilter,   setCandFilter]   = useState('tous');
  const [loaded,       setLoaded]       = useState(false);
  const [actionId,     setActionId]     = useState<string | null>(null);
  const [delConfirm,   setDelConfirm]   = useState<string | null>(null);

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [form,         setForm]         = useState<ArticleForm>(EMPTY_FORM);
  const [coverFile,    setCoverFile]    = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState('');
  const [slugLocked,   setSlugLocked]   = useState(false);

  /* ── Load ── */
  useEffect(() => {
    const token = localStorage.getItem('pes_token');
    if (!token) { router.replace(`/${locale}/admin/login`); return; }
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/articles/admin/all`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/candidatures`,       { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([a, c]) => {
      setArticles(Array.isArray(a) ? a : []);
      setCandidatures(Array.isArray(c) ? c : []);
      setLoaded(true);
    });
  }, [locale, router]);

  /* ── Article CRUD ── */
  async function changeArticleStatut(id: string, statut: string) {
    const token = localStorage.getItem('pes_token');
    if (!token) return;
    await fetch(`${API}/api/articles/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    setArticles(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
    setActionId(null);
  }

  async function deleteArticle(id: string) {
    const token = localStorage.getItem('pes_token');
    if (!token) return;
    await fetch(`${API}/api/articles/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    setArticles(prev => prev.filter(a => a.id !== id));
    setDelConfirm(null);
  }

  /* ── Candidature ── */
  async function changeCandStatut(id: string, statut: string) {
    const token = localStorage.getItem('pes_token');
    if (!token) return;
    await fetch(`${API}/api/candidatures/${id}/statut?statut=${encodeURIComponent(statut)}`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    });
    setCandidatures(prev => prev.map(c => c.id === id ? { ...c, statut } : c));
    setActionId(null);
  }

  /* ── Drawer ── */
  function openCreate() {
    setForm(EMPTY_FORM); setEditingId(null);
    setCoverFile(null); setCoverPreview(null);
    setFormError(''); setSlugLocked(false);
    setDrawerOpen(true);
  }
  function openEdit(art: Article) {
    setForm({
      titre_fr: art.titre_fr, slug: art.slug ?? '',
      categorie: art.categorie, auteur: art.auteur,
      excerpt_fr: art.excerpt_fr ?? '', contenu_fr: art.contenu_fr ?? '',
      youtube_url: art.youtube_url ?? '', audio_url: art.audio_url ?? '',
      reading_time: art.reading_time ?? 5,
      statut: art.statut === 'publié' ? 'publié' : 'brouillon',
    });
    setEditingId(art.id); setCoverFile(null);
    setCoverPreview(art.cover_image_url ?? null);
    setFormError(''); setSlugLocked(true);
    setDrawerOpen(true);
  }
  function closeDrawer() { setDrawerOpen(false); setEditingId(null); }

  function handleTitreChange(val: string) {
    setForm(p => ({ ...p, titre_fr: val, slug: slugLocked ? p.slug : slugify(val) }));
  }
  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    const { titre_fr, slug, categorie, excerpt_fr, contenu_fr } = form;
    if (!titre_fr.trim() || !slug.trim() || !categorie.trim() || !excerpt_fr.trim() || !contenu_fr.trim()) {
      setFormError('Veuillez remplir tous les champs obligatoires (*).'); return;
    }
    const token = localStorage.getItem('pes_token');
    if (!token) return;
    setSaving(true); setFormError('');

    const payload = {
      titre_fr: titre_fr.trim(), slug: slug.trim(),
      categorie: categorie.trim(), auteur: form.auteur.trim() || 'PES',
      excerpt_fr: excerpt_fr.trim(), contenu_fr: contenu_fr.trim(),
      youtube_url: form.youtube_url.trim() || null,
      audio_url:   form.audio_url.trim()   || null,
      reading_time: form.reading_time,
      statut: form.statut,
    };

    try {
      let articleId: string;
      if (editingId) {
        const res = await fetch(`${API}/api/articles/${editingId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setFormError(err.detail ?? 'Erreur lors de la mise à jour.');
          setSaving(false); return;
        }
        const updated = await res.json();
        setArticles(prev => prev.map(a => a.id === editingId ? { ...a, ...updated } : a));
        articleId = editingId;
      } else {
        const res = await fetch(`${API}/api/articles`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setFormError(err.detail ?? 'Erreur lors de la création.');
          setSaving(false); return;
        }
        const created = await res.json();
        setArticles(prev => [created, ...prev]);
        articleId = created.id;
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append('file', coverFile);
        let coverRes: Response;
        try {
          coverRes = await fetch(`${API}/api/articles/${articleId}/cover`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });
        } catch {
          setFormError(
            'Article enregistré ✓ — mais l\'image n\'a pas pu être envoyée (erreur réseau). ' +
            'Vérifiez que le serveur est démarré et réessayez via "Modifier".'
          );
          setSaving(false);
          return;
        }
        if (coverRes.ok) {
          const { cover_image_url } = await coverRes.json();
          setArticles(prev => prev.map(a => a.id === articleId ? { ...a, cover_image_url } : a));
        } else {
          const err = await coverRes.json().catch(() => ({}));
          setFormError(
            `Article enregistré ✓ — mais l'image a échoué : ${err.detail ?? 'Erreur inconnue.'} ` +
            `Créez le bucket "blog-images" (Public) dans Supabase Dashboard → Storage, puis réessayez.`
          );
          setSaving(false);
          return;
        }
      }
      closeDrawer();
    } catch {
      setFormError('Erreur réseau. Vérifiez que le serveur est démarré.');
    } finally {
      setSaving(false);
    }
  }

  /* ── Filtered ── */
  const filteredArticles     = artFilter === 'tous'  ? articles     : articles.filter(a => a.statut === artFilter);
  const filteredCandidatures = candFilter === 'tous' ? candidatures : candidatures.filter(c => c.statut === candFilter);

  const artStats = {
    tous:       articles.length,
    publié:     articles.filter(a => a.statut === 'publié').length,
    brouillon:  articles.filter(a => a.statut === 'brouillon').length,
    archivé:    articles.filter(a => a.statut === 'archivé').length,
  };
  const candStats = {
    tous:       candidatures.length,
    nouveau:    candidatures.filter(c => c.statut === 'nouveau').length,
    en_etude:   candidatures.filter(c => c.statut === 'en_etude').length,
    accepté:    candidatures.filter(c => c.statut === 'accepté').length,
    refusé:     candidatures.filter(c => c.statut === 'refusé').length,
  };

  return (
    <div className="w-full space-y-5">

      {/* ══ MAIN TABS ══ */}
      <div className="flex items-center gap-3">
        {([
          { key: 'blog',      label: 'Articles du blog', Icon: BookOpen, count: articles.length    },
          { key: 'carrieres', label: 'Candidatures',     Icon: Users,   count: candidatures.length },
        ] as const).map(({ key, label, Icon, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: tab === key ? '#0f172a' : '#ffffff',
              color:      tab === key ? '#ffffff'  : '#64748b',
              border:     tab === key ? '1.5px solid #0f172a' : '1.5px solid #e2e8f0',
              boxShadow:  tab === key ? '0 4px 14px rgba(15,23,42,0.25)' : 'none',
            }}>
            <Icon className="w-4 h-4" />
            {label}
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full"
              style={{ background: tab === key ? 'rgba(255,255,255,0.15)' : '#f1f5f9', color: tab === key ? '#fff' : '#64748b' }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════ BLOG TAB ══════════════ */}
      {tab === 'blog' && (
        <div className="space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <MiniStat label="Total articles"  value={artStats.tous}      Icon={FileText}     color="#1d4ed8" bg="#eff6ff" grad="linear-gradient(135deg,#1e40af,#2563eb)" />
            <MiniStat label="Publiés"          value={artStats.publié}    Icon={CheckCircle2} color="#15803d" bg="#f0fdf4" grad="linear-gradient(135deg,#15803d,#16a34a)" />
            <MiniStat label="Brouillons"       value={artStats.brouillon} Icon={Clock}        color="#b45309" bg="#fffbeb" grad="linear-gradient(135deg,#b45309,#d97706)" />
            <MiniStat label="Archivés"         value={artStats.archivé}   Icon={Archive}      color="#64748b" bg="#f1f5f9" grad="linear-gradient(135deg,#475569,#64748b)" />
          </div>

          {/* Filter pills + Create button */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { f: 'tous',      label: 'Tous',       count: artStats.tous      },
                { f: 'publié',    label: 'Publiés',    count: artStats.publié    },
                { f: 'brouillon', label: 'Brouillons', count: artStats.brouillon },
                { f: 'archivé',   label: 'Archivés',   count: artStats.archivé   },
              ].map(({ f, label, count }) => {
                const active = artFilter === f;
                return (
                  <button key={f} onClick={() => setArtFilter(f)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: active ? '#0f172a' : '#ffffff',
                      color:      active ? '#fff'    : '#64748b',
                      border:     active ? '1.5px solid #0f172a' : '1.5px solid #e2e8f0',
                    }}>
                    {label}
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: active ? 'rgba(255,255,255,0.2)' : '#f1f5f9', color: active ? '#fff' : '#64748b' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#1e40af,#3b29cc)', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }}>
              <Plus className="w-4 h-4" /> Nouvel article
            </button>
          </div>

          {/* Articles list */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>

            {!loaded ? (
              <div className="flex justify-center py-14">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>
                  <BookOpen className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-semibold">Aucun article</p>
                <p className="text-slate-400 text-xs mt-1">Créez votre premier article avec le bouton ci-dessus.</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="px-6 py-3 grid grid-cols-[160px_1fr_auto] gap-4 items-center"
                  style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Couverture</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Article</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Actions</p>
                </div>

                <div className="divide-y divide-slate-50">
                  {filteredArticles.map(art => (
                    <div key={art.id}
                      className="px-6 py-5 grid grid-cols-[160px_1fr_auto] gap-5 items-center hover:bg-blue-50/20 transition-colors">

                      {/* Cover */}
                      <div className="rounded-xl overflow-hidden flex-shrink-0"
                        style={{ height: 96, border: '1.5px solid #e2e8f0', background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)' }}>
                        {art.cover_image_url ? (
                          <img src={art.cover_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <ImageIcon className="w-6 h-6 text-blue-300" />
                            <span className="text-[9px] text-blue-200 font-medium">Pas d'image</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        {/* Badges */}
                        <div className="flex items-center flex-wrap gap-1.5 mb-2">
                          <Badge statut={art.statut} />
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: '#f1f5f9', color: '#64748b' }}>
                            {art.categorie}
                          </span>
                          {art.youtube_url && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: '#fef2f2', color: '#dc2626' }}>
                              <Youtube className="w-2.5 h-2.5" /> Vidéo
                            </span>
                          )}
                          {art.audio_url && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: '#f0fdf4', color: '#15803d' }}>
                              <Music className="w-2.5 h-2.5" /> Audio
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">
                          {art.titre_fr}
                        </h4>

                        {art.excerpt_fr && (
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-1 mb-2">
                            {art.excerpt_fr}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                          <span className="font-semibold text-blue-600">{art.auteur}</span>
                          <span className="text-slate-200">·</span>
                          {art.reading_time && (
                            <>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{art.reading_time} min
                              </span>
                              <span className="text-slate-200">·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{fmtDate(art.created_at)}
                          </span>
                          {art.published_at && (
                            <>
                              <span className="text-slate-200">·</span>
                              <span className="text-green-600 font-medium">Publié le {fmtDate(art.published_at)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 relative">
                        <button onClick={() => openEdit(art)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                          style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                          <Edit2 className="w-3.5 h-3.5" /> Modifier
                        </button>

                        <a href={`/${locale}/blog/${art.slug}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                          style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                          <Eye className="w-3.5 h-3.5" />
                        </a>

                        <button onClick={() => setActionId(actionId === art.id ? null : art.id)}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                          style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                          Statut <ChevronDown className="w-3 h-3" />
                        </button>

                        {actionId === art.id && (
                          <div className="absolute right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl py-1.5 min-w-[140px]"
                            style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                            {ART_STATUTS.map(s => {
                              const st = STATUS_STYLE[s];
                              return (
                                <button key={s} onClick={() => changeArticleStatut(art.id, s)}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50"
                                  style={{ color: st.color }}>
                                  {st.label}
                                  {art.statut === s && <Check className="w-3 h-3" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {delConfirm === art.id ? (
                          <button onClick={() => deleteArticle(art.id)}
                            className="text-xs font-bold px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all">
                            Confirmer
                          </button>
                        ) : (
                          <button onClick={() => setDelConfirm(art.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ CARRIÈRES TAB ══════════════ */}
      {tab === 'carrieres' && (
        <div className="space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <MiniStat label="Total candidats"  value={candStats.tous}     Icon={Users}      color="#1d4ed8" bg="#eff6ff" grad="linear-gradient(135deg,#1e40af,#2563eb)" />
            <MiniStat label="Nouveaux"          value={candStats.nouveau}  Icon={AlertTriangle} color="#b45309" bg="#fffbeb" grad="linear-gradient(135deg,#b45309,#d97706)" />
            <MiniStat label="En cours"          value={candStats.en_etude} Icon={Clock}      color="#7c3aed" bg="#f5f3ff" grad="linear-gradient(135deg,#5b21b6,#7c3aed)" />
            <MiniStat label="Acceptés"          value={candStats.accepté}  Icon={UserCheck}  color="#15803d" bg="#f0fdf4" grad="linear-gradient(135deg,#15803d,#16a34a)" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { f: 'tous',      label: 'Tous',      count: candStats.tous     },
              { f: 'nouveau',   label: 'Nouveaux',  count: candStats.nouveau  },
              { f: 'en_etude',  label: 'En étude',  count: candStats.en_etude },
              { f: 'entretien', label: 'Entretien', count: candidatures.filter(c => c.statut === 'entretien').length },
              { f: 'accepté',   label: 'Acceptés',  count: candStats.accepté  },
              { f: 'refusé',    label: 'Refusés',   count: candStats.refusé   },
            ].map(({ f, label, count }) => {
              const active = candFilter === f;
              return (
                <button key={f} onClick={() => setCandFilter(f)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? '#0f172a' : '#ffffff',
                    color:      active ? '#fff'    : '#64748b',
                    border:     active ? '1.5px solid #0f172a' : '1.5px solid #e2e8f0',
                  }}>
                  {label}
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : '#f1f5f9', color: active ? '#fff' : '#64748b' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Candidatures list */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>

            {!loaded ? (
              <div className="flex justify-center py-14">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : filteredCandidatures.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>
                  <Users className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-semibold">Aucune candidature</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
                  <p className="text-xs font-bold text-slate-500">
                    {filteredCandidatures.length} candidat{filteredCandidatures.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredCandidatures.map(c => {
                    const plan = c.niveau_service?.toLowerCase();
                    const planColor = plan ? (PLAN_COLORS[plan] ?? '#64748b') : '#64748b';
                    return (
                      <div key={c.id}
                        className="px-6 py-5 flex items-center gap-4 hover:bg-blue-50/20 transition-colors">

                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ring-2 ring-white"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}>
                          {c.nom[0]}{c.prenom[0]}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-bold text-slate-800 text-sm">{c.prenom} {c.nom}</p>
                            {c.matricule && (
                              <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded"
                                style={{ background: '#fffbeb', color: '#b45309', fontFamily: 'ui-monospace, monospace' }}>
                                {c.matricule}
                              </span>
                            )}
                            <Badge statut={c.statut} />
                            {plan && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize"
                                style={{ background: `${planColor}12`, color: planColor }}>
                                {plan}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-xs font-medium mb-1">{c.poste_vise}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                            <span>{c.email}</span>
                            <span className="text-slate-200">·</span>
                            <span>{c.telephone}</span>
                            <span className="text-slate-200">·</span>
                            <span>{c.annees_experience} d'expérience</span>
                            <span className="text-slate-200">·</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{fmtDate(c.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Matières */}
                        {c.matieres && (
                          <div className="hidden xl:block text-xs text-slate-400 max-w-[140px] truncate flex-shrink-0">
                            {c.matieres}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 relative">
                          <Link
                            href={`/${locale}/admin/gestion/candidatures/${c.id}`}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:opacity-90 text-white"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                            <Eye className="w-3.5 h-3.5" /> Voir
                          </Link>
                          {c.cv_url && (
                            <a href={c.cv_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                              style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                              <ExternalLink className="w-3.5 h-3.5" /> CV
                            </a>
                          )}
                          <button onClick={() => setActionId(actionId === c.id ? null : c.id)}
                            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                            style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
                            Statut <ChevronDown className="w-3 h-3" />
                          </button>
                          {actionId === c.id && (
                            <div className="absolute right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl py-1.5 min-w-[150px]"
                              style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                              {CAND_STATUTS.map(s => {
                                const st = STATUS_STYLE[s];
                                return (
                                  <button key={s} onClick={() => changeCandStatut(c.id, s)}
                                    className="w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50"
                                    style={{ color: st.color }}>
                                    {st.label}
                                    {c.statut === s && <Check className="w-3 h-3" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ DRAWER — Article ══════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />

          <div className="relative w-full max-w-2xl h-full bg-white flex flex-col shadow-2xl"
            style={{ borderLeft: '1.5px solid #e2e8f0' }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1.5px solid #f1f5f9', background: '#fafbff' }}>
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {editingId ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Les champs * sont obligatoires</p>
              </div>
              <button onClick={closeDrawer}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {formError && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {formError}
                </div>
              )}

              {/* ── Contenu ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2">Contenu</p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Titre *</label>
                    <input className={inputCls} placeholder="Titre de l'article..."
                      value={form.titre_fr} onChange={e => handleTitreChange(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Slug URL *
                      <button onClick={() => setSlugLocked(p => !p)}
                        className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all"
                        style={{ background: slugLocked ? '#eff6ff' : '#f1f5f9', color: slugLocked ? '#1d4ed8' : '#64748b' }}>
                        {slugLocked ? '🔒 manuel' : '✏️ automatique'}
                      </button>
                    </label>
                    <input className={inputCls} placeholder="mon-article-slug"
                      value={form.slug}
                      onChange={e => { setSlugLocked(true); setForm(p => ({ ...p, slug: e.target.value })); }} />
                    <p className="text-[10px] text-slate-400 mt-1">URL publique : /blog/<strong>{form.slug || 'slug'}</strong></p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Résumé (excerpt) *</label>
                    <textarea className={`${inputCls} resize-none`} rows={2}
                      placeholder="Courte description affichée sur la liste du blog..."
                      value={form.excerpt_fr}
                      onChange={e => setForm(p => ({ ...p, excerpt_fr: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contenu principal *</label>
                    <textarea className={`${inputCls} resize-none font-mono text-[13px]`} rows={12}
                      placeholder={`Rédigez votre article ici...\n\nLigne vide = nouveau paragraphe\n## Titre de section\n# Grand titre`}
                      value={form.contenu_fr}
                      onChange={e => setForm(p => ({ ...p, contenu_fr: e.target.value }))} />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {form.contenu_fr.length} car. · Ligne vide = §  · ## = sous-titre  · # = grand titre
                    </p>
                  </div>
                </div>
              </section>

              {/* ── Médias ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2">Médias (optionnels)</p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-500" /> Lien YouTube
                    </label>
                    <input className={inputCls} placeholder="https://www.youtube.com/watch?v=..."
                      value={form.youtube_url}
                      onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-green-600" /> Lien audio
                    </label>
                    <input className={inputCls} placeholder="https://... (mp3, wav, ogg)"
                      value={form.audio_url}
                      onChange={e => setForm(p => ({ ...p, audio_url: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Image de couverture
                    </label>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
                    {coverPreview ? (
                      <div className="relative rounded-xl overflow-hidden" style={{ height: 150, border: '1.5px solid #e2e8f0' }}>
                        <img src={coverPreview} alt="Couverture" className="w-full h-full object-cover" />
                        <button onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {coverFile && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-black/50">
                            Nouveau fichier sélectionné
                          </div>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl transition-all hover:border-blue-300 hover:bg-blue-50/50"
                        style={{ border: '1.5px dashed #cbd5e1', background: '#f8faff' }}>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">Cliquez pour choisir une image</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP — max 5 Mo</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Paramètres ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2">Paramètres</p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Catégorie *</label>
                    <input className={inputCls} list="cat-list" placeholder="Ex: Mathématiques..."
                      value={form.categorie}
                      onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))} />
                    <datalist id="cat-list">
                      {PREDEFINED_CATEGORIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Auteur</label>
                    <input className={inputCls} placeholder="PES"
                      value={form.auteur}
                      onChange={e => setForm(p => ({ ...p, auteur: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Temps de lecture (min)</label>
                    <input type="number" min={1} max={60} className={inputCls}
                      value={form.reading_time}
                      onChange={e => setForm(p => ({ ...p, reading_time: parseInt(e.target.value) || 5 }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Statut de publication</label>
                    <select className={inputCls}
                      value={form.statut}
                      onChange={e => setForm(p => ({ ...p, statut: e.target.value as 'brouillon' | 'publié' }))}>
                      <option value="brouillon">Brouillon</option>
                      <option value="publié">Publier maintenant</option>
                    </select>
                  </div>
                </div>
                {form.statut === 'publié' && (
                  <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold"
                    style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cet article sera visible sur le blog public après enregistrement.
                  </div>
                )}
              </section>
            </div>

            {/* Drawer footer */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1.5px solid #f1f5f9', background: '#fafbff' }}>
              <p className="text-[11px] text-slate-400">
                {editingId ? 'Modification d\'un article existant' : 'Création d\'un nouvel article'}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={closeDrawer}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                  Annuler
                </button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#3b29cc)', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }}>
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement...</>
                  ) : (
                    <><Check className="w-4 h-4" /> {editingId ? 'Mettre à jour' : 'Enregistrer l\'article'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
