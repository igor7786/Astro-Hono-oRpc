import { eq } from 'drizzle-orm';

import { closeSqlite, sqliteDb } from '@/lib/drizzle/sqlite/client';
import { test } from '@/lib/drizzle/sqlite/schema';

await sqliteDb
  .insert(test)
  .values({
    key: 'ping',
    value: 'pong',
    createdAt: new Date(),
  })
  .onConflictDoUpdate({
    target: test.key,
    set: {
      value: 'pong',
      createdAt: new Date(),
    },
  });

console.log('✅ Inserted');
const rows = await sqliteDb.select().from(test).where(eq(test.key, 'ping'));

console.log('✅ [SQLITE -> DRIZZLE] Rows:', rows[0]?.value);
closeSqlite();
process.exit(0);
