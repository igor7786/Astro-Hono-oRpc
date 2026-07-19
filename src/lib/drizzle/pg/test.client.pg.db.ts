import { eq } from 'drizzle-orm';

import { db } from '@/lib/drizzle/pg/client.pg.db';
import { ogTest } from '@/lib/drizzle/pg/pg.schema';

try {
  const result = await db.select().from(ogTest).where(eq(ogTest.key, 'og:test'));
  const value = result[0].value;
  console.log('SELECT og_test:', value, '✅');
  await db.$client.end();
} catch (err: any) {
  console.error('❌ Postgres error ❌:', err?.message);
} finally {
  process.exit(0);
}
