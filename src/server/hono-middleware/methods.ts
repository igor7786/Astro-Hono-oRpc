import { createMiddleware } from 'hono/factory';

import { openApiPrefix } from '@/lib/helpers/paths/api.paths';
import { generateOpenApiSchema } from '@/lib/schemas/orpc/openapi.schema.generator';

import type { Hono } from 'hono';

// Single source of truth: used by the oRPC handler AND the 405 middleware.

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;

const normalise = (p: string) => p.replace(/\/+$/, '') || '/';

// '/api/users/:id', '/api/users/{id}' -> /^\/api\/users\/[^/]+$/
function patternToRegex(pattern: string) {
  const src = normalise(pattern)
    .split('/')
    .map((seg) => {
      if (seg.startsWith('{+') && seg.endsWith('}')) return '.+'; // OpenAPI-style rest param
      if (seg.startsWith(':') || (seg.startsWith('{') && seg.endsWith('}'))) return '[^/]+';
      if (seg === '*') return '.*';
      return seg.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return new RegExp(`^${src}$`);
}

type Entry = { re: RegExp; methods: Set<string> };
let entries: Entry[] | null = null;

async function getEntries(app: Hono<any>): Promise<Entry[]> {
  if (entries) return entries;

  const byPattern = new Map<string, Set<string>>();

  const add = (pattern: string, methods: string[]) => {
    const key = normalise(pattern);
    const set = byPattern.get(key) ?? new Set<string>();
    for (const m of methods) {
      const upper = m.toUpperCase();
      set.add(upper);
      if (upper === 'GET') set.add('HEAD'); // Hono answers HEAD via GET
    }
    byPattern.set(key, set);
  };

  // 1. Everything registered directly in Hono (app.get/post/...).
  //    Skip 'ALL' (app.use / app.all) and wildcard mounts like /rpc/*.
  for (const r of app.routes) {
    if (r.method === 'ALL' || r.path.includes('*')) continue;
    add(r.path, [r.method]);
  }

  // 2. Everything declared in the OpenAPI spec (oRPC), under the real prefix.
  try {
    const rawSpec = await generateOpenApiSchema();
    const spec = typeof rawSpec === 'string' ? JSON.parse(rawSpec) : rawSpec;

    for (const [path, item] of Object.entries(spec?.paths ?? {})) {
      if (!item || typeof item !== 'object') continue;
      const methods = HTTP_METHODS.filter((m) => m in item).map((m) => m.toUpperCase());
      if (!methods.length) continue;

      add(`${openApiPrefix}${path.startsWith('/') ? path : `/${path}`}`, methods);
    }
  } catch (err) {
    // Don't let spec generation break error handling; Hono routes still work.
    console.error('[allowedMethods] failed to read OpenAPI spec:', err);
  }

  entries = [...byPattern].map(([p, methods]) => ({ re: patternToRegex(p), methods }));

  if (process.env.DEBUG_METHODS) {
    console.log([...byPattern].map(([p, m]) => `${p} [${[...m].join(',')}]`));
  }

  return entries;
}

export default function allowedMethods(app: Hono<any>) {
  return createMiddleware(async (c, next) => {
    await next();
    if (c.res.status !== 404) return;

    const path = normalise(c.req.path);
    const allowed = new Set<string>();

    for (const e of await getEntries(app)) {
      if (e.re.test(path)) e.methods.forEach((m) => allowed.add(m));
    }

    if (allowed.size > 0 && !allowed.has(c.req.method)) {
      const list = [...allowed].sort();
      c.res = c.json({ error: 'Method Not Allowed', path: c.req.path, allowedMethods: list }, 405, {
        Allow: list.join(', '),
      }) as any;
      return;
    }

    c.res = c.json({ error: 'Not Found', path: c.req.path }, 404) as any;
  });
}
