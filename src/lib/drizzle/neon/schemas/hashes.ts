import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const hashes = pgTable('hashes', {
  // Your HMAC-signed opaque hash ID — primary key, computed from the input params
  id: text('id').primaryKey(),

  hash: text('hash').notNull(),

  format: text('format', { enum: ['script', 'style'] }).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),
});

export type Hash = typeof hashes.$inferSelect;
export type NewHash = typeof hashes.$inferInsert;
