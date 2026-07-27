import { envServer } from '@/lib/env/server.env';

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
  if (isProd) {
    console.log('✅ [Redpanda] Running in production mode, connecting without TLS...');
    return {
      clientId: 'astro-hono-orpc',
      bootstrapBrokers: brokers,
      sasl: {
        mechanism: 'SCRAM-SHA-256' as const,
        username: envServer.KAFKA_APP_USER,
        password: envServer.KAFKA_APP_USER_PASSWORD,
      },
    };
  }
  console.log('⚠️ [Redpanda] Running in development mode, connecting to remote VPS with mTLS...');
  const { tls } = await import('@/lib/tls/client.tls');
  return {
    clientId: 'astro-hono-orpc',
    bootstrapBrokers: brokers,
    sasl: {
      mechanism: 'SCRAM-SHA-256' as const,
      username: envServer.KAFKA_APP_USER,
      password: envServer.KAFKA_APP_USER_PASSWORD,
    },
    tls: await tls(),
  };
}
const baseConfig = await getBaseConfig();

export { baseConfig };
