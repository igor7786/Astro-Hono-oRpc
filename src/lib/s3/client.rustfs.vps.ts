import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import http from 'http';
import https from 'https';

import { envServer } from '@/lib/env/server.env';

async function getRustfsClient() {
  const isProd = envServer.PRODUCTION !== 'false';

  isProd
    ? console.log('✅ [RustFS] Running in production mode, connecting without TLS...')
    : console.log('⚠️ [RustFS] Running in development mode, connecting to remote VPS with mTLS...');
  const endpoint = isProd ? envServer.PROD_RUSTFS_ENDPOINT : envServer.VPS_RUSTFS_ENDPOINT;
  const agent =
    envServer.PRODUCTION === 'true'
      ? {
          httpAgent: new http.Agent({ keepAlive: true }),
        }
      : {
          httpsAgent: await (async () => {
            const { ca, cert, key, rejectUnauthorized } = await (
              await import('@/lib/tls/client.tls')
            ).tls();
            return new https.Agent({
              ca,
              cert,
              key,
              rejectUnauthorized,
              keepAlive: true,
            });
          })(),
        };
  const requestHandler = new NodeHttpHandler({
    ...agent,
    connectionTimeout: 3000,
    socketTimeout: 5000,
  });
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: envServer.RUSTFS_ACCESS_KEY,
      secretAccessKey: envServer.RUSTFS_SECRET_KEY,
    },
    endpoint,
    forcePathStyle: true,
    requestHandler,
  });
  return client;
}

const rustfsClient = await getRustfsClient();
export { rustfsClient };
