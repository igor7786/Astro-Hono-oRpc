// src/lib/drizzle/pg/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

import { join } from 'node:path';

import { envServer } from '@/lib/env/server.env';

// FIX: Define relative paths from your project root folder
console.log('📁 Schema Path :', join(process.cwd(), '/src/lib/drizzle/neon/schemas/index.ts'));
console.log('📁 Migrations Path:', join(process.cwd(), '/src/lib/drizzle/neon/migrations'));
const schema = './src/lib/drizzle/neon/schemas/index.ts';
const out = './src/lib/drizzle/neon/migrations';
export default defineConfig({
  dialect: 'postgresql',
  schema,
  out, // Drizzle Kit will now read this relative path perfectly
  dbCredentials: {
    url: envServer.NEON_DB_URL,
  },
});
