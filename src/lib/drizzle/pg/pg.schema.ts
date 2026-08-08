import { snakeCase, text, timestamp } from 'drizzle-orm/pg-core';

export const test = snakeCase.table('test', {
  key: text('key').primaryKey(),
  value: text('value'),
  createdAt: timestamp().defaultNow().notNull(),
});
