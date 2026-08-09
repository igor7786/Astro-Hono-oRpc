import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import https from 'https';

import { envServer } from '@/lib/env/server.env';

async function getRustfsClient() {
  envServer.PRODUCTION === 'false'
    ? console.log('⚠️ [RustFS] Running in development mode, connecting to remote VPS with mTLS...')
    : console.log('✅ [RustFS] Running in production mode, connecting without TLS...');
  const tls =
    envServer.PRODUCTION === 'false' ? await (await import('@/lib/tls/client.tls')).tls() : undefined;
  const ca = tls?.ca;
  const cert = tls?.cert;
  const key = tls?.key;
  const rejectUnauthorized = tls?.rejectUnauthorized;
  const httpsAgent = tls ? new https.Agent({ ca, cert, key, rejectUnauthorized }) : undefined;
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: envServer.RUSTFS_ACCESS_KEY,
      secretAccessKey: envServer.RUSTFS_SECRET_KEY,
    },
    endpoint: envServer.VPS_RUSTFS_ENDPOINT,
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      httpsAgent,
      connectionTimeout: 3000,
      socketTimeout: 5000,
    }),
  });
  return client;
}

const rustfsClient = await getRustfsClient();
export { rustfsClient };
