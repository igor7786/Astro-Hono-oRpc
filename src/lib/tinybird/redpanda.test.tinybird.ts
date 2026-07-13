/**
 * Redpanda → Tinybird bridge
 *
 * Consumes from the Redpanda "test" topic (via mTLS + SASL, same as
 * the app's existing Kafka client) and forwards messages to Tinybird's
 * Events API over plain HTTPS, batched as NDJSON for efficiency.
 *
 * Run standalone (not imported by lib/tinybird.ts):
 *   bun run src/lib/redpanda-to-tinybird.ts
 */
import { Consumer, jsonDeserializer, stringDeserializer } from '@platformatic/kafka';

import { envServer } from '@/lib/env/server.env';
import { tls } from '@/lib/tls/client.tls';

const brokers = envServer.VPS_KAFKA_BROKERS_DEV.split(',');

const consumer = new Consumer({
  clientId: 'redpanda-to-tinybird-bridge',
  groupId: 'tinybird-bridge-consumer',
  bootstrapBrokers: brokers,
  sasl: {
    mechanism: 'SCRAM-SHA-256' as const,
    username: envServer.KAFKA_USERNAME,
    password: envServer.KAFKA_PASSWORD,
  },
  tls: await tls(),
  deserializers: {
    key: stringDeserializer,
    value: jsonDeserializer,
    headerKey: stringDeserializer,
    headerValue: stringDeserializer,
  },
});

const TINYBIRD_HOST = envServer.TINYBIRD_URL;
const TINYBIRD_TOKEN = envServer.TINYBIRD_TOKEN;

// --- Batching Tuning Parameters ---
const BATCH_SIZE_LIMIT = 500; // Max records per single HTTP push
const BATCH_TIME_LIMIT_MS = 2000; // Force flush every 2 seconds max latency

let currentBatch: object[] = [];
let lastFlushTime = Date.now();
let isShuttingDown = false;

/**
 * Packs collected events into NDJSON and ships them to Tinybird via a single HTTP post
 */
async function flushToTinybird(datasource: string, events: object[]) {
  if (events.length === 0) return;

  const ndjsonBody = events.map((event) => JSON.stringify(event)).join('\n');

  try {
    const res = await fetch(`${TINYBIRD_HOST}/v0/events?name=${datasource}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TINYBIRD_TOKEN}`,
      },
      body: ndjsonBody,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Tinybird ingest failed (${res.status}):`, text);
    } else {
      console.log(`➡️  Successfully batch-forwarded ${events.length} messages to Tinybird.`);
    }
  } catch (err) {
    console.error('❌ Critical network exception pushing batch to Tinybird:', err);
  }
}

async function run() {
  console.log('🌉 Bridge started, consuming from "test" topic...');

  const stream = await consumer.consume({ topics: ['test'] });

  // Fallback timer loop to flush stale messages during low traffic intervals
  const flushInterval = setInterval(() => {
    const now = Date.now();
    if (currentBatch.length > 0 && now - lastFlushTime >= BATCH_TIME_LIMIT_MS) {
      const batchToFlush = [...currentBatch];
      currentBatch = [];
      lastFlushTime = now;

      flushToTinybird('test', batchToFlush).catch(console.error);
    }
  }, 500);

  // Graceful shutdown: flush whatever's pending before exiting
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n🛑 Received ${signal}, flushing remaining batch and shutting down...`);
    clearInterval(flushInterval);

    if (currentBatch.length > 0) {
      await flushToTinybird('test', currentBatch);
      currentBatch = [];
    }

    try {
      await consumer.close();
    } catch (err) {
      console.error('Error closing consumer:', err);
    }

    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  for await (const message of stream) {
    if (isShuttingDown) break;

    const value = message.value as Record<string, unknown>;

    currentBatch.push({
      timestamp: new Date().toISOString(),
      payload: JSON.stringify(value),
    });

    if (currentBatch.length >= BATCH_SIZE_LIMIT) {
      const batchToFlush = [...currentBatch];
      currentBatch = [];
      lastFlushTime = Date.now();

      // Fire and forget in the background to avoid blocking the consumer stream
      flushToTinybird('test', batchToFlush).catch(console.error);
    }
  }
}

if (import.meta.main) {
  run().catch((err) => {
    console.error('❌ Bridge crashed:', err);
    process.exit(1);
  });
}
