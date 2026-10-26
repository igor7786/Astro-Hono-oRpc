import { join } from 'node:path';

import { defineConfig } from 'drizzle-kit';

console.log('📁 Schema Path :', join(process.cwd(), '/src/lib/drizzle/sqlite/schemas/index.ts'));
console.log('📁 Migrations Path:', join(process.cwd(), '/src/lib/drizzle/sqlite/db/migrations'));
const schema = './src/lib/drizzle/sqlite/schemas/index.ts';
const out = './src/lib/drizzle/sqlite/db/migrations';

export default defineConfig({
  dialect: 'sqlite',
  schema,
  out,
  dbCredentials: {
    url: './src/lib/drizzle/sqlite/db/sqlite.db',
  },
});
