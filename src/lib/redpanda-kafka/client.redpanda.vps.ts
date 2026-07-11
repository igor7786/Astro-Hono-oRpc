import { envServer } from '@/lib/env/server.env';
import { tls } from '@/lib/tls/client.tls';

/**
 * =========================
 * CONFIG
 * =========================
 */

const brokers = envServer.VPS_KAFKA_BROKERS_DEV.split(',');

const baseConfig = {
  clientId: 'astro-hono-orpc',
  bootstrapBrokers: brokers,
  sasl: {
    mechanism: 'SCRAM-SHA-256' as const,
    username: envServer.KAFKA_USERNAME,
    password: envServer.KAFKA_PASSWORD,
  },
  tls,
};
export { baseConfig };
