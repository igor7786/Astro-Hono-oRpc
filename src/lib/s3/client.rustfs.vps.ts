import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import https from 'https';

import { envServer } from '@/lib/env/server.env';
import { tls } from '@/lib/tls/client.tls';

let rustfsClient: S3Client;

if (envServer.PRODUCTION === 'false') {
  console.log('⚠️ Running in development mode, connecting to remote VPS RustFS with mTLS...');
  rustfsClient = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: envServer.RUSTFS_ACCESS_KEY,
      secretAccessKey: envServer.RUSTFS_SECRET_KEY,
    },
    endpoint: envServer.RUSTFS_ENDPOINT,
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      httpsAgent: new https.Agent({
        ca: (await tls()).ca,
        cert: (await tls()).cert,
        key: (await tls()).key,
        rejectUnauthorized: (await tls()).rejectUnauthorized,
      }),
      connectionTimeout: 3000,
      socketTimeout: 5000,
    }),
  });
} else {
  console.log('✅ Running in production mode, connecting to local RustFS without mTLS...');
  rustfsClient = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: envServer.RUSTFS_ACCESS_KEY,
      secretAccessKey: envServer.RUSTFS_SECRET_KEY,
    },
    endpoint: 'http://rustfs:9000',
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 3000,
      socketTimeout: 5000,
    }),
  });
}

export { rustfsClient };
