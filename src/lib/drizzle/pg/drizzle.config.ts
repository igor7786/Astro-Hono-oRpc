// src/lib/drizzle/pg/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

import { readFileSync } from 'node:fs';

const ca = readFileSync(process.env.VPS_CA_CERT!, 'utf-8');
const cert = readFileSync(process.env.VPS_CLIENT_CERT!, 'utf-8');
const key = readFileSync(process.env.VPS_CLIENT_KEY!, 'utf-8');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/drizzle/pg/pg.schema.ts',
  out: './src/lib/drizzle/pg/migrations',
  dbCredentials: {
    host: process.env.VPS_PG_HOST!,
    port: Number(process.env.VPS_PG_PORT),
    user: process.env.VPS_PG_USER!,
    password: process.env.VPS_PG_PASS!,
    database: process.env.VPS_PG_DB!,
    ssl: {
      ca,
      cert,
      key,
      rejectUnauthorized: true,
    },
  },
});
