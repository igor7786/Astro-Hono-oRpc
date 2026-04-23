import { implement } from '@orpc/server';
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins';
import type { Context } from 'hono';

import { envServer } from '@/lib/env/server.env';
import { appContract } from '@/server/contracts/all.contracts';
import { isValErrors } from '@/server/middlewares/validation-errors';

interface ORPCContext extends ResponseHeadersPluginContext {}
export type AppContext = {
  ctx?: Context;
  request?: Request;
  response?: Response;
  signal?: AbortSignal;
  env?: typeof envServer;
  // responseHeaders?: Headers;
} & ORPCContext;
const os = implement(appContract);
// Base public procedure — no auth required
export const base = os.$context<AppContext>().use(isValErrors); // ← middleware applied to all procedures
