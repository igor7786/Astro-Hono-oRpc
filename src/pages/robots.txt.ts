// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);

  // Optional: block in non-production
  const isProd = import.meta.env.PROD;
  const allowAll = isProd ? 'Allow: /' : 'Disallow: /';

  return new Response(
    `User-agent: *
${allowAll}

Sitemap: ${sitemapURL.href}
`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
