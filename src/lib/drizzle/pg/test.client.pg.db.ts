import { eq } from 'drizzle-orm';

import { db } from '@/lib/drizzle/pg/client.pg.db';
import { test } from '@/lib/drizzle/pg/pg.schema';

try {
  // INSERT or UPDATE
  await db
    .insert(test)
    .values({
      key: 'og:test',
      value: 'Hello PostgreSQL',
    })
    .onConflictDoUpdate({
      target: test.key,
      set: {
        value: 'Hello PostgreSQL',
      },
    });

  console.log('✅ Upserted');

  // SELECT
  const [row] = await db.select().from(test).where(eq(test.key, 'og:test'));

  console.log('✅ Value:', row?.value);

  await db.$client.end();
} catch (err: any) {
  console.error('❌ Postgres error:', err?.message);
} finally {
  process.exit(0);
}
