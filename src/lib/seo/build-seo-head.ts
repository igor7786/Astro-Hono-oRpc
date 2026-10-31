// src/lib/seo/build-seo-head.ts
import type { SeoData } from '@/lib/seo/get-seo.fn';

export function buildSeoHead(seo?: SeoData) {
  if (!seo) return {};
  const { title, description, author, date, type, siteName, siteUrl, ogImageUrl } = seo;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    '@id': siteUrl,
    name: title,
    url: siteUrl,
    description,
    ...(author && { author: { '@type': 'Person', name: author } }),
    ...(date && { datePublished: date }),
  })
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

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
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  };
}
