import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const hashes = sqliteTable('hashes', {
  // Your HMAC-signed opaque hash ID — primary key, computed from the input params
  id: text('id').primaryKey(),
  hash: text('hash').notNull(),
  format: text('format', { enum: ['script', 'style'] }).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Hash = typeof hashes.$inferSelect;
export type NewHash = typeof hashes.$inferInsert;
