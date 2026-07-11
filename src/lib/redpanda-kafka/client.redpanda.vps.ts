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
export { baseConfig };
