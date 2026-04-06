// src/server/procedures/procedures.ts
import type { Context } from 'hono';
import { isValErrors } from '@server/middlewares/validation-errors';
import { appContract } from '@server/contracts/all.contracts';
import { implement } from '@orpc/server';

export type AppContext = {
  request?: Request;
  response?: Response;
  ctx?: Context;
  signal?: AbortSignal;
};
const os = implement(appContract);
// Base public procedure — no auth required
export const base = os.$context<AppContext>().use(isValErrors); // ← middleware applied to all procedures
