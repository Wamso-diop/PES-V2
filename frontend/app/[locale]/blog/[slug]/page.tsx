import type { Metadata } from 'next';
import ArticleClient from './_article';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL  = 'https://pes-douala.cm';
const API       = process.env.NEXT_PUBLIC_API_URL ?? '';

async function fetchArticle(slug: string) {
  try {
    const res = await fetch(`${API}/api/articles/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await fetchArticle(params.slug);

  if (!article) {
    return {
      title: 'Article introuvable | Blog PES Douala',
      description: 'Cet article n\'est pas disponible.',
    };
  }

  const title       = article.titre_fr ?? 'Article PES';
  const description = article.excerpt_fr ?? `Lisez cet article sur le blog de PES Douala : ${title}`;
  const image       = article.cover_image_url ?? `${BASE_URL}/images/pes-banner.jpg`;
  const url         = `${BASE_URL}/${params.locale}/blog/${params.slug}`;

  return {
    title: `${title} | Blog PES Douala`,
    description,
    keywords: [
      article.categorie,
      'blog soutien scolaire Douala',
      'conseils scolaires Cameroun',
      'PES Douala blog',
    ].filter(Boolean),
    authors: [{ name: article.auteur ?? 'Équipe PES' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      publishedTime: article.published_at,
      authors: [article.auteur ?? 'Équipe PES'],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const article = await fetchArticle(params.slug);

  return (
    <>
      {article && (
        <>
          <ArticleJsonLd
            title={article.titre_fr}
            description={article.excerpt_fr ?? ''}
            datePublished={article.published_at ?? new Date().toISOString()}
            image={article.cover_image_url}
            author={article.auteur}
            url={`${BASE_URL}/${params.locale}/blog/${params.slug}`}
          />
          <BreadcrumbJsonLd items={[
            { name: 'Accueil', url: `${BASE_URL}/${params.locale}` },
            { name: 'Blog',    url: `${BASE_URL}/${params.locale}/blog` },
            { name: article.titre_fr, url: `${BASE_URL}/${params.locale}/blog/${params.slug}` },
          ]} />
        </>
      )}
      <ArticleClient />
    </>
  );
}
