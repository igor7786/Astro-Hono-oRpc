// src/lib/drizzle/pg/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

import { readFileSync } from 'node:fs';

const ca = readFileSync(process.env.VPS_CA_CERT!, 'utf-8');
const cert = readFileSync(process.env.VPS_CLIENT_CERT!, 'utf-8');
const key = readFileSync(process.env.VPS_CLIENT_KEY!, 'utf-8');

// FIX: Define relative paths from your project root folder
const schema = './src/lib/drizzle/pg/pg.schema.ts';
const out = './src/lib/drizzle/pg/migrations';

console.log('📁 Schema Path :', schema);
console.log('📁 Migrations Path:', out);

export default defineConfig({
  dialect: 'postgresql',
  schema,
  out, // Drizzle Kit will now read this relative path perfectly
  dbCredentials: {
    host: process.env.VPS_PGB_HOST!,
    port: Number(process.env.VPS_PGB_PORT!),
    user: process.env.VPS_PGB_USER!,
    password: process.env.VPS_PGB_PASS!,
    database: process.env.VPS_PGB_DB!,
    ssl: {
      ca,
      cert,
      key,
      rejectUnauthorized: true,
    },
  },
});
