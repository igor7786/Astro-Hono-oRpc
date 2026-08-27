import { createMiddleware } from 'hono/factory';

import { generateOpenApiSchema } from '@/server/schemas/openapi.schema.generator';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;

let routeMethodMap: Map<string, Set<string>> | null = null;

async function getRouteMethodMap() {
  if (routeMethodMap) return routeMethodMap;

  const spec = await generateOpenApiSchema();
  routeMethodMap = new Map();

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    if (!pathItem) continue;

    const methods = HTTP_METHODS.filter((m) => m in pathItem).map((m) => m.toUpperCase());
    if (methods.length === 0) continue;

    const fullPath = `/api/openapi${path}`;
    routeMethodMap.set(fullPath, new Set(methods));
  }

  return routeMethodMap;
}

const allowedMethods = createMiddleware(async (c, next) => {
  await next();

  // ✅ Only step in if nothing downstream actually handled the request.
  // Any other status (200, 204, 401, 500, etc.) means a real handler
  // already ran — leave its response alone.
  if (c.res.status !== 404) return;

  const map = await getRouteMethodMap();
  const allowed = map.get(c.req.path);

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (allowed && !allowed.has(c.req.method)) {
    headers.set('Allow', [...allowed].join(', '));
    c.res = c.json(
      { error: 'Method Not Allowed', path: c.req.path, allowedMethods: [...allowed] },
      405,
      Object.fromEntries(headers)
    ) as any;
    return;
  }

  c.res = c.json({ error: 'Not Found', path: c.req.path }, 404, Object.fromEntries(headers)) as any;
});

export default allowedMethods;
