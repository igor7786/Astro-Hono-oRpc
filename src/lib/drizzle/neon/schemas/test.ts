import { snakeCase, text, timestamp } from 'drizzle-orm/pg-core';

export const test = snakeCase.table('test', {
  key: text('key').primaryKey(),

  value: text('value').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
});
export type Test = typeof test.$inferSelect;
export type NewTest = typeof test.$inferInsert;
