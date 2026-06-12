'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, ArrowRight, Calendar, Youtube, Music, BookOpen } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Article {
  id: string;
  slug: string;
  titre_fr: string;
  excerpt_fr?: string;
  cover_image_url?: string;
  categorie: string;
  auteur: string;
  published_at?: string;
  reading_time: number;
  youtube_url?: string;
  audio_url?: string;
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Mathématiques':      { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  'Examens':            { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Conseils aux parents': { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  'Éducation':          { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Anglais':            { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  'Bien-être':          { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  'Actualités':         { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
  'Sciences':           { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  'Concours':           { bg: '#fef9c3', text: '#ca8a04', border: '#fde68a' },
  'Français':           { bg: '#fdf4ff', text: '#a21caf', border: '#f0abfc' },
};
const DEFAULT_CAT = { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
function catStyle(cat: string) { return CAT_COLORS[cat] ?? DEFAULT_CAT; }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function CoverPlaceholder({ categorie }: { categorie: string }) {
  const s = catStyle(categorie);
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: s.bg }}>
      <BookOpen className="w-10 h-10" style={{ color: s.text, opacity: 0.3 }} />
    </div>
  );
}

export default function BlogClient() {
  const pathname = usePathname();
  const locale   = pathname.split('/')[1] || 'fr';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('Tous');

  useEffect(() => {
    fetch(`${API}/api/articles`)
      .then(r => r.json())
      .then(data => { setArticles(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['Tous', ...Array.from(new Set(articles.map(a => a.categorie)))];
  const filtered   = filter === 'Tous' ? articles : articles.filter(a => a.categorie === filter);
  const [featured, ...rest] = filtered;

  return (
    <div className="pt-[72px] bg-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
            opacity: 0.4,
          }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1.5 rounded-full"
            style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
            Blog PES
          </span>
          <h1 className="font-display font-extrabold text-slate-900 leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
            Conseils et ressources{' '}
            <span style={{
              background: 'linear-gradient(95deg, #1d4ed8 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              pour réussir
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Articles pédagogiques, astuces de révision et actualités scolaires
            pour accompagner élèves et parents tout au long de l&apos;année.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Category filter ── */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                style={filter === cat
                  ? { background: '#1e40af', color: '#fff' }
                  : { background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Chargement des articles...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#eff6ff' }}>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-2">Aucun article publié</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Nos experts préparent du contenu de qualité. Revenez bientôt !
            </p>
          </div>
        )}

        {/* ── Featured article ── */}
        {!loading && featured && (
          <Link href={`/${locale}/blog/${featured.slug}`}
            className="group block mb-10">
            <div className="grid lg:grid-cols-[1fr_1fr] rounded-2xl overflow-hidden transition-shadow duration-300
                           shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
              style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>

              {/* Image */}
              <div className="relative h-56 lg:h-auto min-h-[240px] overflow-hidden">
                {featured.cover_image_url ? (
                  <img src={featured.cover_image_url} alt={featured.titre_fr}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <CoverPlaceholder categorie={featured.categorie} />
                )}
                {/* Media badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {featured.youtube_url && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                      style={{ background: 'rgba(220,38,38,0.9)' }}>
                      <Youtube className="w-3 h-3" /> Vidéo
                    </span>
                  )}
                  {featured.audio_url && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full text-white"
                      style={{ background: 'rgba(21,128,61,0.9)' }}>
                      <Music className="w-3 h-3" /> Audio
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 lg:p-9 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: catStyle(featured.categorie).bg, color: catStyle(featured.categorie).text, border: `1px solid ${catStyle(featured.categorie).border}` }}>
                    {featured.categorie}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {featured.reading_time} min de lecture
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-slate-900 text-xl lg:text-2xl leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                  {featured.titre_fr}
                </h2>
                {featured.excerpt_fr && (
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{featured.excerpt_fr}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {featured.published_at ? fmtDate(featured.published_at) : featured.auteur}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: catStyle(featured.categorie).text }}>
                    Lire la suite
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Articles grid ── */}
        {!loading && rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(article => {
              const cs = catStyle(article.categorie);
              return (
                <Link key={article.slug} href={`/${locale}/blog/${article.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ background: '#ffffff', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(15,23,42,0.07)' }}>

                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} alt={article.titre_fr}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                    ) : (
                      <CoverPlaceholder categorie={article.categorie} />
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {article.youtube_url && (
                        <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: 'rgba(220,38,38,0.85)' }}>
                          <Youtube className="w-2.5 h-2.5" /> Vidéo
                        </span>
                      )}
                      {article.audio_url && (
                        <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: 'rgba(21,128,61,0.85)' }}>
                          <Music className="w-2.5 h-2.5" /> Audio
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                        {article.categorie}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" /> {article.reading_time} min
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-slate-900 text-[0.95rem] leading-snug mb-2.5 group-hover:text-blue-700 transition-colors flex-1">
                      {article.titre_fr}
                    </h2>
                    {article.excerpt_fr && (
                      <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{article.excerpt_fr}</p>
                    )}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                      <span className="text-slate-400 text-xs">
                        {article.published_at ? fmtDate(article.published_at) : article.auteur}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: cs.text }}>
                        Lire <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
