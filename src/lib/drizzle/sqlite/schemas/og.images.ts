import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ogImages = sqliteTable('og_images', {
  // Your HMAC-signed opaque hash ID — primary key, computed from the input params
  id: text('id').primaryKey(),
  token: text('token').notNull(),
  title: text('title').notNull().default('Fast Web Tech'),
  description: text('description').notNull().default('My awesome app'),
  author: text('author').notNull().default('Alberto'),
  format: text('format', { enum: ['webp', 'png'] })
    .notNull()
    .default('png'),

  // Store as ISO string (matches your zod .transform(formatDate) output)
  date: text('date').notNull(),

  // Cache/generation bookkeeping — useful for your warming consumer + tiered lookup
  status: text('status', { enum: ['pending', 'ready', 'failed'] })
    .notNull()
    .default('pending'),

  rustfsKey: text('rustfs_key'), // populated once durably stored in RustFS

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type OgImage = typeof ogImages.$inferSelect;
export type NewOgImage = typeof ogImages.$inferInsert;
