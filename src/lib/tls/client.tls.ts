import { envServer } from '@/lib/env/server.env';

/**
 * =========================
 * TYPES
 * =========================
 */

interface TlsConfig {
  servername: string;
  ca: string;
  cert: string;
  key: string;
  rejectUnauthorized: boolean;
}
/**
 * =========================
 * LAZY, CACHED TLS CONFIG
 * =========================
 */

async function getTls(): Promise<TlsConfig> {
  console.log('🔐[TLS] Loading certs...');
  const cachedTls = {
    servername: envServer.VPS_TLS_SERVER,
    ca: await Bun.file(envServer.VPS_CA_CERT).text(),
    cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
    key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
    rejectUnauthorized: true, // Set to true in production for security
  };
  return cachedTls;
}

export { getTls as tls };
