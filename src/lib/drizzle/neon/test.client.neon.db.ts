import { eq } from 'drizzle-orm';

import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import { test } from '@/lib/drizzle/neon/schemas';

try {
  // INSERT or UPDATE
  await neonDb
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
  const [row] = await neonDb.select().from(test).where(eq(test.key, 'Ping'));

  console.log('✅ Value:', row?.value);

  await neonDb.$client.end();
} catch (err: any) {
  console.error('❌ Neon error:', err?.message, err?.cause ?? err);
} finally {
  process.exit(0);
}
