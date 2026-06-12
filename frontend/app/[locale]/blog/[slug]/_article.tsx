'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, Youtube, Volume2, BookOpen, ExternalLink } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Article {
  id: string;
  slug: string;
  titre_fr: string;
  excerpt_fr?: string;
  contenu_fr: string;
  cover_image_url?: string;
  categorie: string;
  auteur: string;
  published_at?: string;
  reading_time: number;
  youtube_url?: string;
  audio_url?: string;
}

const CAT_COLORS: Record<string, string> = {
  'Mathématiques': '#15803d', 'Examens': '#1d4ed8', 'Conseils aux parents': '#7c3aed',
  'Éducation': '#1d4ed8', 'Anglais': '#ea580c', 'Bien-être': '#0d9488',
  'Actualités': '#e11d48', 'Sciences': '#059669', 'Concours': '#ca8a04', 'Français': '#a21caf',
};
function catColor(cat: string) { return CAT_COLORS[cat] ?? '#1d4ed8'; }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

function renderContent(text: string, color: string) {
  return text.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="font-display font-bold text-slate-900 text-xl mb-3 mt-8"
          style={{ paddingLeft: '0.875rem', borderLeft: `3px solid ${color}` }}>
          {block.slice(3)}
        </h2>
      );
    }
    if (block.startsWith('# ')) {
      return (
        <h1 key={i} className="font-display font-bold text-slate-900 text-2xl mb-4 mt-8">
          {block.slice(2)}
        </h1>
      );
    }
    return (
      <p key={i} className="text-slate-600 leading-relaxed text-[0.95rem] mb-4">
        {block.split('\n').map((line, j) => (
          <span key={j}>{j > 0 && <br />}{line}</span>
        ))}
      </p>
    );
  });
}

export default function ArticleClient() {
  const params = useParams();
  const slug   = params.slug as string;
  const locale = params.locale as string || 'fr';

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/api/articles/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (data) { setArticle(data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const color = article ? catColor(article.categorie) : '#1d4ed8';

  /* ── Loading ── */
  if (loading) return (
    <div className="pt-[72px] min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Chargement de l&apos;article...</p>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (notFound || !article) return (
    <div className="pt-[72px] min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#eff6ff' }}>
          <BookOpen className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="font-bold text-slate-900 text-2xl mb-3">Article introuvable</h1>
        <p className="text-slate-400 text-sm mb-6">Cet article n&apos;existe pas ou n&apos;est plus publié.</p>
        <Link href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white"
          style={{ background: '#1d4ed8' }}>
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>
      </div>
    </div>
  );

  const videoId = article.youtube_url ? getYoutubeId(article.youtube_url) : null;

  return (
    <div className="pt-[72px] bg-white min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden"
        style={{ minHeight: 360, background: 'linear-gradient(160deg, #07111f 0%, #0c1a3a 55%, #0f2057 100%)' }}>

        {/* Cover image overlay */}
        {article.cover_image_url && (
          <>
            <img src={article.cover_image_url} alt={article.titre_fr}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7,17,31,0.95) 0%, rgba(7,17,31,0.6) 60%, rgba(7,17,31,0.3) 100%)' }} />
          </>
        )}

        {/* Back button */}
        <Link href={`/${locale}/blog`}
          className="absolute top-6 left-4 sm:left-8 lg:left-16 z-10 flex items-center gap-2 text-white/80 text-sm font-medium
                     bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-full hover:bg-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        {/* Title content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 pt-20 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white"
              style={{ background: color }}>
              {article.categorie}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs">
              <Clock className="w-3 h-3" />
              {article.reading_time} min de lecture
            </span>
            {article.published_at && (
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <Calendar className="w-3 h-3" />
                {fmtDate(article.published_at)}
              </span>
            )}
          </div>

          <h1 className="font-display font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>
            {article.titre_fr}
          </h1>

          {article.excerpt_fr && (
            <p className="text-white/70 text-base max-w-2xl leading-relaxed">
              {article.excerpt_fr}
            </p>
          )}

          {/* Media badges in hero */}
          {(videoId || article.audio_url) && (
            <div className="flex items-center gap-2 mt-5">
              {videoId && (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: 'rgba(220,38,38,0.25)', border: '1px solid rgba(220,38,38,0.4)' }}>
                  <Youtube className="w-3.5 h-3.5 text-red-400" /> Contient une vidéo
                </span>
              )}
              {article.audio_url && (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ background: 'rgba(21,128,61,0.25)', border: '1px solid rgba(21,128,61,0.4)' }}>
                  <Volume2 className="w-3.5 h-3.5 text-green-400" /> Contient un audio
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Article body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">

          {/* ── Main column ── */}
          <div>
            {/* Author + share */}
            <div className="flex items-center justify-between pb-6 mb-8"
              style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: color }}>
                  {article.auteur.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{article.auteur}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{article.categorie}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-500 px-4 py-2 rounded-full transition-all hover:bg-slate-50"
                style={{ border: '1px solid #e2e8f0' }}
                onClick={() => navigator.share?.({ title: article.titre_fr, url: window.location.href })}>
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>

            {/* ── YouTube Embed ── */}
            {videoId && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <p className="font-bold text-slate-800 text-sm">Vidéo associée</p>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden"
                  style={{ paddingTop: '56.25%', background: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="Vidéo YouTube"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {!article.cover_image_url && (
                  <p className="text-xs text-slate-400 text-center mt-2">
                    <a href={article.youtube_url!} target="_blank" rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Ouvrir sur YouTube
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* ── Audio Player ── */}
            {article.audio_url && (
              <div className="mb-8 rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg,#f8faff,#eff6ff)', border: '1.5px solid #bfdbfe' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Écouter l&apos;article en audio</p>
                    <p className="text-slate-400 text-xs mt-0.5">Version audio de cet article</p>
                  </div>
                </div>
                <audio controls className="w-full mt-1" style={{ outline: 'none', borderRadius: '0.75rem' }}>
                  <source src={article.audio_url} />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              </div>
            )}

            {/* ── Text content ── */}
            <article className="max-w-none">
              {renderContent(article.contenu_fr, color)}
            </article>

            {/* Back link */}
            <div className="mt-12 pt-8" style={{ borderTop: '1px solid #f1f5f9' }}>
              <Link href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour au blog
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block sticky top-28 space-y-4">

            {/* Article info */}
            <div className="rounded-2xl p-5"
              style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-4" style={{ color: '#94a3b8' }}>
                Cet article
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  {article.reading_time} min de lecture
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-600">
                  <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  {article.categorie}
                </li>
                {article.published_at && (
                  <li className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    {fmtDate(article.published_at)}
                  </li>
                )}
                {videoId && (
                  <li className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Youtube className="w-4 h-4 flex-shrink-0 text-red-500" />
                    Vidéo incluse
                  </li>
                )}
                {article.audio_url && (
                  <li className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Volume2 className="w-4 h-4 flex-shrink-0 text-blue-500" />
                    Audio disponible
                  </li>
                )}
              </ul>

              {/* CTA */}
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid #e2e8f0' }}>
                <p className="text-xs text-slate-500 mb-3">
                  Votre enfant a besoin d&apos;un accompagnement personnalisé ?
                </p>
                <Link href={`/${locale}/inscription`}
                  className="block text-center text-sm font-bold py-2.5 px-4 rounded-xl text-white transition-all hover:opacity-90"
                  style={{ background: color }}>
                  S&apos;inscrire maintenant
                </Link>
              </div>
            </div>

            {/* Share block */}
            <div className="rounded-2xl p-5" style={{ border: '1.5px solid #e2e8f0' }}>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-3 text-slate-400">
                Partager
              </p>
              <button
                onClick={() => navigator.share?.({ title: article.titre_fr, url: window.location.href })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                style={{ border: '1px solid #e2e8f0' }}>
                <Share2 className="w-4 h-4" />
                Partager cet article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
