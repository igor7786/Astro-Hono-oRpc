import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import https from 'https';

import { envServer } from '@/lib/env/server.env';

async function getRustfsClient() {
  if (envServer.PRODUCTION === 'false') {
    console.log('⚠️ [RustFS] Running in development mode, connecting to remote VPS with mTLS...');
    const { tls } = await import('@/lib/tls/client.tls');
    const { ca, cert, key, rejectUnauthorized } = await tls();
    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: envServer.RUSTFS_ACCESS_KEY,
        secretAccessKey: envServer.RUSTFS_SECRET_KEY,
      },
      endpoint: envServer.VPS_RUSTFS_ENDPOINT,
      forcePathStyle: true,
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          ca,
          cert,
          key,
          rejectUnauthorized,
        }),
        connectionTimeout: 3000,
        socketTimeout: 5000,
      }),
    });
    return client;
  } else {
    console.log('✅ [RustFS] Running in production mode, connecting without mTLS...');
    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: envServer.RUSTFS_ACCESS_KEY,
        secretAccessKey: envServer.RUSTFS_SECRET_KEY,
      },
      endpoint: envServer.PROD_RUSTFS_ENDPOINT,
      forcePathStyle: true,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        socketTimeout: 5000,
      }),
    });
    return client;
  }
}

const rustfsClient = await getRustfsClient();
export { rustfsClient };
