import { envServer } from '@/lib/env/server.env';
import { tls as getTls } from '@/lib/tls/client.tls';

/**
 * =========================
 * CONFIG
 * =========================
 */

const isProd = envServer.PRODUCTION === 'true';

const brokers = isProd
  ? envServer.VPS_KAFKA_BROKERS_PROD.split(',')
  : envServer.VPS_KAFKA_BROKERS_DEV.split(',');

/**
 * =========================
 * LAZY BASE CONFIG
 * (tls certs only read when this is actually called)
 * =========================
 */

async function getBaseConfig() {
  const tls = isProd ? undefined : await getTls();

  return {
    clientId: 'astro-hono-orpc',
    bootstrapBrokers: brokers,
    sasl: {
      mechanism: 'SCRAM-SHA-256' as const,
      username: envServer.KAFKA_USERNAME,
      password: envServer.KAFKA_PASSWORD,
    },
    tls,
  };
}
const baseConfig = getBaseConfig();
export { baseConfig };
