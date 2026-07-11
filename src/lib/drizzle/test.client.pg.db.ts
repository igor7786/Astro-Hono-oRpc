import { eq } from 'drizzle-orm';

// adjust path
import { ogTest } from '@/lib//drizzle/pg.schema';
import { db, pgPool } from '@/lib/drizzle/client.pg.db';

// adjust path

try {
  const ping = await pgPool.query('SELECT 1');
  console.log('PING:', ping.rows);

  await pgPool.query(`CREATE TABLE IF NOT EXISTS og_test (key TEXT PRIMARY KEY, value TEXT)`);

  await pgPool.query(
    'INSERT INTO og_test (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    ['og:test', 'hello world']
  );
  console.log('INSERT og_test ✅');

  const result = await db.select().from(ogTest).where(eq(ogTest.key, 'og:test'));
  console.log('SELECT og_test:', result[0].value, '✅');
} catch (err: any) {
  console.error('❌ Postgres error ❌:', err?.message);
} finally {
  await pgPool.end();
}
