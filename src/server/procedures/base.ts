import { implement } from '@orpc/server';
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins';
import type { Context } from 'hono';

import type { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import type { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { envServer } from '@/lib/env/server.env';
import { redisVps } from '@/lib/redis/client.redis.vps';
import { producer } from '@/lib/redpanda-kafka/producer';
import type { rustfsClient } from '@/lib/s3/client.rustfs.vps';
import { appContract } from '@/server/contracts/all.contracts';
import { type Geo } from '@/server/hono-middleware/geo';
import { isValErrors } from '@/server/middlewares/validation-errors';

interface ORPCContext extends ResponseHeadersPluginContext {}
export type AppContext = {
  ctx?: Context;
  request?: Request;
  response?: Response;
  signal?: AbortSignal;
  env?: typeof envServer;
  sqlite?: typeof sqliteDb;
  pg?: typeof pgDb;
  neon?: typeof neonDb;
  producer?: typeof producer;
  rustfs?: typeof rustfsClient;
  redis?: typeof redisVps;
  geo?: Geo;
  // responseHeaders?: Headers;
} & ORPCContext;
const os = implement(appContract);
// Base public procedure — no auth required
export const base = os.$context<AppContext>().use(isValErrors); // ← middleware applied to all procedures
