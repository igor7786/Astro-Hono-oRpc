// src/lib/seo/build-seo-head.ts
import type { SeoData } from '@/lib/seo/seo.core';

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

type LinkTag = { rel: string; href: string };
type ScriptTag = { type: string; children: string };

export type SeoHead = {
  meta: MetaTag[];
  links: LinkTag[];
  scripts: ScriptTag[];
};

function buildJsonLd(seo: SeoData): string {
  const { title, description, author, date, type, siteName, siteUrl, ogImageUrl } = seo;
  const origin = new URL(siteUrl).origin;

  const data =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${siteUrl}#article`,
          headline: title,
          description,
          url: siteUrl,
          mainEntityOfPage: siteUrl,
          image: ogImageUrl,
          ...(author && { author: { '@type': 'Person', name: author } }),
          ...(date && { datePublished: date }),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          name: siteName,
          url: `${origin}/`,
          description,
        };

  // Escape < and > so the JSON can never close the <script> tag
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

export function buildSeoHead(seo?: SeoData): SeoHead {
  if (!seo) return { meta: [], links: [], scripts: [] };

  const { title, description, author, date, type, siteName, siteUrl, ogImageUrl } = seo;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },

      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: siteUrl },
      { property: 'og:image', content: ogImageUrl },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      ...(type === 'article' && date ? [{ property: 'article:published_time', content: date }] : []),
      ...(type === 'article' && author ? [{ property: 'article:author', content: author }] : []),

      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImageUrl },
    ],
    links: [{ rel: 'canonical', href: siteUrl }],
    scripts: [{ type: 'application/ld+json', children: buildJsonLd(seo) }],
  };
}
