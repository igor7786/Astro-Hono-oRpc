import { envServer } from '@/lib/env/server.env';

/**
 * =========================
 * TYPES
 * =========================
 */

interface TlsConfig {
  servername: string;
  ca: string | undefined;
  cert: string;
  key: string;
  rejectUnauthorized: boolean;
}
/**
 * =========================
 * LAZY, CACHED TLS CONFIG
 * =========================
 */

async function getTls(usesHomeCaServerCert = false): Promise<TlsConfig> {
  console.log('🔐[TLS] Loading certs...');
  return {
    servername: envServer.VPS_TLS_SERVER,
    ca: usesHomeCaServerCert ? await Bun.file(envServer.VPS_CA_CERT).text() : undefined,
    cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
    key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
    rejectUnauthorized: true,
  };
}

export { getTls as tls };
