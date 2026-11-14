// src/server/routes/vendor.ts
import { resolve } from 'node:path';

import { envServer } from '@/lib/env/server.env';
import { base } from '@/server/procedures/base';

const isProd = envServer.PRODUCTION === 'true';

const scalarFilePath = resolve(
  process.cwd(),
  isProd ? 'dist/client/vendor/scalar-api-reference.js' : 'public/vendor/scalar-api-reference.js'
);

export const scalarBundleRoute = base.vendor.scalarBundle.handler(async ({ errors }) => {
  const file = Bun.file(scalarFilePath);

  if (!(await file.exists())) {
    throw errors.NOT_FOUND({
      message: `Scalar bundle not found at ${scalarFilePath} ❌`,
    });
  }

  return {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
    },
    body: file,
  };
});
