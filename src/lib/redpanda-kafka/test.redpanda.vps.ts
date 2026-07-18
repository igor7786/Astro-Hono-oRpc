import { Admin, Producer, stringSerializers } from '@platformatic/kafka';

import { baseConfig } from '@/lib/redpanda-kafka/config.redpanda.vps';

/**
 * =========================
 * CLIENTS (lazy singletons, long-lived)
 * =========================
 */

let admin: Admin | null = null;
let producer: Producer<string, string, string, string> | null = null;

async function getAdmin(): Promise<Admin> {
  if (!admin) {
    const config = baseConfig;
    admin = new Admin(config);
  }
  return admin;
}

async function getProducer(): Promise<Producer<string, string, string, string>> {
  if (!producer) {
    const config = baseConfig;
    producer = new Producer<string, string, string, string>({
      ...config,
      serializers: stringSerializers,
    });
  }
  return producer;
}

/**
 * =========================
 * SAFE TOPIC CREATION
 * =========================
 */

async function safeCreateTopics() {
  try {
    console.log('📦 Creating topics...');

    const adminClient = await getAdmin();

    await adminClient.createTopics({
      topics: ['og_image'],
      partitions: 3,
      replicas: 3,
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
 * (run manually / once — not per-request)
 * =========================
 */

async function bootstrapKafka() {
  try {
    console.log('🚀 Bootstrapping Kafka...');

    await safeCreateTopics();

    const adminClient = await getAdmin();
    const metadata = await adminClient.metadata({ topics: [] });

    console.log('📊 Brokers:', metadata.brokers);
    console.log('📊 Topics:', metadata.topics);
  } catch (err) {
    console.error('❌ bootstrapKafka failed:', err);
  } finally {
    try {
      await admin?.close();
      admin = null;
    } catch {}
  }
}

/**
 * =========================
 * PRODUCER
 * (long-lived — do NOT close after every send)
 * =========================
 */

export async function sendTestMessage() {
  try {
    console.log('📤 Sending message...');

    const producerClient = await getProducer();

    await producerClient.send({
      messages: [
        {
          topic: 'og_image',
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
    throw err;
  }
}

/**
 * =========================
 * GRACEFUL SHUTDOWN
 * Call once at process exit, not per-request.
 * =========================
 */

export async function shutdownKafkaClients() {
  console.log('🛑 Shutting down Kafka clients...');

  try {
    producer?.close(true);
  } catch (err) {
    console.error('❌ Error closing producer:', err);
  } finally {
    producer = null;
  }

  try {
    await admin?.close();
  } catch (err) {
    console.error('❌ Error closing admin:', err);
  } finally {
    admin = null;
  }
}

process.on('SIGTERM', async () => {
  await shutdownKafkaClients();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await shutdownKafkaClients();
  process.exit(0);
});

/**
 * =========================
 * RUN (manual script mode only)
 * =========================
 */

if (import.meta.main) {
  console.log('🔥 Starting Kafka script');

  // await bootstrapKafka();
  await sendTestMessage();
  await shutdownKafkaClients();

  console.log('🏁 Done');
}
