import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';

import https from 'https';

import { envServer } from '@/lib/env/server.env';

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
        ca: await Bun.file(envServer.VPS_CA_CERT).text(),
        cert: await Bun.file(envServer.VPS_CLIENT_CERT).text(),
        key: await Bun.file(envServer.VPS_CLIENT_KEY).text(),
        rejectUnauthorized: true,
      }),
      connectionTimeout: 3000,
      socketTimeout: 5000,
    }),
  });
} else {
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
