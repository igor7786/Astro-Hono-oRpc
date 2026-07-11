import { envServer } from '@/lib/env/server.env';

const tls = {
  servername: envServer.VPS_TLS_SERVER,
  ca: await Bun.file(envServer.VPS_CA_CERT).text(),
  cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
  key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
  rejectUnauthorized: true,
};

export { tls };
