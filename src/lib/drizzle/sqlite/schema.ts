import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const test = sqliteTable('test', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  key: text('key').notNull().unique(),

  value: text('value').notNull(),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).notNull(),
});
