import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/drizzle/sqlite/schema.ts',
  out: './src/lib/drizzle/sqlite/migrations',
  dbCredentials: {
    url: './src/lib/drizzle/sqlite/sqlite.db',
  },
});
