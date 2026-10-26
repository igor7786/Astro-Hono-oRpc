// src/server/hono-middleware/scalar.ts
import { Scalar } from '@scalar/hono-api-reference';

import { openApiBasePath } from '@/lib/helpers/paths';

const HOME_BUTTON = `<a href="/" style="position:fixed;bottom:16px;right:16px;z-index:9999;display:inline-flex;align-items:center;gap:8px;padding:9px 16px 9px 14px;border-radius:30px;background:#111;color:#fff;font:600 13px system-ui,sans-serif;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Home</a>`;

const scalarHandler = Scalar<{ Variables: { cspNonce: string } }>((c) => {
  const nonce = c.get('cspNonce');
  return {
    sources: [{ url: `${openApiBasePath}/generate-schema`, title: 'App API' }],
    nonce,
    cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest', // pin an exact version when you can
    theme: 'fastify',
  };
});

const scalar: typeof scalarHandler = async (c, next) => {
  const res = await scalarHandler(c, next);
  if (!res) return res;

  const html = await res.text();
  const headers = new Headers(res.headers);
  headers.delete('content-length');

  return new Response(html.replace('</body>', `${HOME_BUTTON}</body>`), {
    status: res.status,
    headers,
  });
};

export default scalar;
