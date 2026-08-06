import { defineConfig } from 'drizzle-kit';

import { join } from 'node:path';

console.log('📁 Schema Path :', join(process.cwd(), '/src/lib/drizzle/sqlite/schema.ts'));
console.log('📁 Migrations Path:', join(process.cwd(), '/src/lib/drizzle/sqlite/db/migrations'));
const schema = 'src/lib/drizzle/sqlite/schema.ts';
const out = 'src/lib/drizzle/sqlite/db/migrations';

export default defineConfig({
  dialect: 'sqlite',
  schema,
  out,
  dbCredentials: {
    url: './src/lib/drizzle/sqlite/db/sqlite.db',
  },
});
