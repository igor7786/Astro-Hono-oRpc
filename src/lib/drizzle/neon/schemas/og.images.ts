import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const ogImages = pgTable('og_images', {
  // Your HMAC-signed opaque hash ID — primary key, computed from the input params
  id: text('id').primaryKey(),

  token: text('token').notNull(),

  title: text('title').notNull().default('Fast Web Tech'),

  description: text('description').notNull().default('My awesome app'),

  author: text('author'),

  format: text('format', {
    enum: ['webp', 'png'],
  })
    .notNull()
    .default('png'),

  // Store as ISO string (matches your Zod .transform(formatDate) output)
  date: text('date'),

  // Cache/generation bookkeeping
  status: text('status', {
    enum: ['pending', 'ready', 'failed'],
  })
    .notNull()
    .default('pending'),

  rustfsKey: text('rustfs_key'),

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

export type OgImage = typeof ogImages.$inferSelect;
export type NewOgImage = typeof ogImages.$inferInsert;
