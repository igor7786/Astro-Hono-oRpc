import { Admin, Producer, stringSerializers } from '@platformatic/kafka';

import { envServer } from '@/lib/env/server.env';

/**
 * =========================
 * CONFIG
 * =========================
 */

const isProd = envServer.PRODUCTION === 'true';

const brokers = !isProd
  ? envServer.VPS_KAFKA_BROKERS_DEV.split(',')
  : envServer.VPS_KAFKA_BROKERS_PROD.split(',');

const tls = !isProd
  ? {
      servername: envServer.VPS_TLS_SERVER,
      ca: await Bun.file(envServer.VPS_CA_CERT).text(),
      cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
      key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
      rejectUnauthorized: true,
    }
  : undefined;

const baseConfig = {
  clientId: 'astro-hono-orpc',
  bootstrapBrokers: brokers,
  sasl: {
    mechanism: 'SCRAM-SHA-256' as const,
    username: envServer.KAFKA_USERNAME,
    password: envServer.KAFKA_PASSWORD,
  },
  ...(tls && { tls }),
};

/**
 * =========================
 * CLIENTS
 * =========================
 */

const admin = new Admin(baseConfig);

const producer = new Producer({
  ...baseConfig,
  serializers: stringSerializers,
});

/**
 * =========================
 * SAFE TOPIC CREATION
 * =========================
 */

async function safeCreateTopics() {
  try {
    console.log('📦 Creating topics...');

    await admin.createTopics({
      topics: ['users', 'events', 'logs', 'test'],
      partitions: 3,
      replicas: 1,
    });

    console.log('📦 Topics created');
  } catch (err: any) {
    // Platformatic throws if topic already exists
    if (err?.apiId === 'TOPIC_ALREADY_EXISTS') {
      console.log('ℹ️ Topics already exist, skipping');
      return;
    }

    console.error('❌ createTopics error:', err);
    throw err;
  }
}

/**
 * =========================
 * BOOTSTRAP
 * =========================
 */

async function bootstrapKafka() {
  try {
    console.log('🚀 Bootstrapping Kafka...');

    await safeCreateTopics();

    const metadata = await admin.metadata({ topics: [] });

    console.log('📊 Brokers:', metadata.brokers);
    console.log('📊 Topics:', metadata.topics);
  } catch (err) {
    console.error('❌ bootstrapKafka failed:', err);
  } finally {
    try {
      await admin.close();
    } catch {}
  }
}

/**
 * =========================
 * PRODUCER
 * =========================
 */

async function sendTestMessage() {
  try {
    console.log('📤 Sending message...');

    await producer.send({
      messages: [
        {
          topic: 'test',
          key: 'user-123',
          value: JSON.stringify({
            event: 'USER_LOGIN',
            name: 'John',
            timestamp: Date.now(),
          }),
          headers: {
            source: 'web-app',
          },
        },
      ],
    });

    console.log('✅ Message sent');
  } catch (err) {
    console.error('❌ Producer error:', err);
  } finally {
    try {
      await producer.close(true);
    } catch {}
  }
}

/**
 * =========================
 * RUN
 * =========================
 */

if (import.meta.main) {
  console.log('🔥 Starting Kafka script');

  // await bootstrapKafka();
  await sendTestMessage();

  console.log('🏁 Done');
}
