// src/server/routes/vendor.ts

import { getJsAsset } from '@scalar/server-side-rendering';

import { base } from '@/server/procedures/base';

const rawSsrJs = getJsAsset().replace(/\/\/# sourceMappingURL=.*$/m, '');

const scalarSsrBlob = new Blob([rawSsrJs], {
  type: 'application/javascript; charset=utf-8',
});

export const scalarBundleRoute = base.vendor.scalarBundle.handler(async () => {
  return {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
    },
    body: scalarSsrBlob,
  };
});
