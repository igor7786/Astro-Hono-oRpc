import http from 'node:http';
import https from 'node:https';

import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import { envServer } from '@/lib/env/server.env';

async function getRustfsClient() {
  const isProd = envServer.PRODUCTION !== 'false';

  const message = isProd
    ? '✅ [RustFS] Running in production mode, connecting without TLS...'
    : '⚠️ [RustFS] Running in development mode, connecting to remote VPS with mTLS...';

  console.log(message);
  const endpoint = isProd ? envServer.PROD_RUSTFS_ENDPOINT : envServer.VPS_RUSTFS_ENDPOINT;
  const agent = isProd
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
