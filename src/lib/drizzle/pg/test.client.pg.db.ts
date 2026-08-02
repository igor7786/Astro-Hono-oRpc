import { eq } from 'drizzle-orm';

import { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { test } from '@/lib/drizzle/pg/pg.schema';

try {
  // INSERT or UPDATE
  await pgDb
    .insert(test)
    .values({
      key: 'Ping',
      value: 'Pong',
    })
    .onConflictDoUpdate({
      target: test.key,
      set: {
        value: 'Pong',
      },
    });

  console.log('✅ Upserted');

  // SELECT
  const [row] = await pgDb.select().from(test).where(eq(test.key, 'Ping'));

  console.log('✅ Value:', row?.value);

  await pgDb.$client.end();
} catch (err: any) {
  console.error('❌ Postgres error:', err?.message, err?.cause ?? err);
} finally {
  process.exit(0);
}
