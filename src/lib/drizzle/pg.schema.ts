import { pgTable, text } from 'drizzle-orm/pg-core';

export const ogTest = pgTable('og_test', {
  key: text('key').primaryKey(),
  value: text('value'),
});
