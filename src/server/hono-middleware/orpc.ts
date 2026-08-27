import { createMiddleware } from 'hono/factory';

import { envServer } from '@/lib/env/server.env';
import { openApiBasePath, rpcBasePath } from '@/lib/helpers/paths';
import openApiHandler from '@/server/handlers/openapi.handler';
import rpcHandler from '@/server/handlers/rpc.handler';

// ─── RPC + OpenAPI + HEAD handler
const orpcMiddleware = createMiddleware(async (c, next) => {
  // ─── RPC handler ───────────────────────────────────────────────────────────
  const res = await rpcHandler.handle(c.req.raw, {
    prefix: rpcBasePath,
    context: {
      env: envServer,
      sqlite: c.get('sqlite'),
      pg: c.get('pg'),
      neon: c.get('neon'),
      producer: c.get('producer'),
      rustfs: c.get('rustfs'),
      redis: c.get('redis'),
      geo: c.get('geo'),
    },
  });
  if (res.matched) {
    return c.newResponse(res.response.body, res.response);
  }

  const context = {
    request: c.req.raw,
    response: c.res,
    ctx: c,
    signal: c.req.raw.signal,
    env: envServer,
    sqlite: c.get('sqlite'),
    pg: c.get('pg'),
    neon: c.get('neon'),
    producer: c.get('producer'),
    rustfs: c.get('rustfs'),
    redis: c.get('redis'),
    geo: c.get('geo'),
  };
  // ─── OpenAPI handler ───────────────────────────────────────────────────────
  const apiRes = await openApiHandler.handle(c.req.raw, {
    prefix: openApiBasePath,
    context,
  });
  if (apiRes.matched) {
    return c.newResponse(apiRes.response.body, apiRes.response);
  }

  await next();
});

export default orpcMiddleware;
