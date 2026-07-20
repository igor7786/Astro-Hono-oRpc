import { pgTable, text } from 'drizzle-orm/pg-core';

export const test = pgTable('test', {
  key: text('key').primaryKey(),
  value: text('value'),
});
