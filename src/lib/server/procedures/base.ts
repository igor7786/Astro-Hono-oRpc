// src/server/procedures/procedures.ts
import type { Context } from 'hono';
import { isValErrors } from '@server/middlewares/validation-errors';
import { appContract } from '@server/contracts/all.contracts';
import { implement } from '@orpc/server';
import { envServer } from '@/lib/env/server.env';
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins';
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
