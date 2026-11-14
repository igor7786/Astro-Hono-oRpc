// src/server/contracts/vendor.ts
import z from 'zod';

import { baseOc } from '@/server/contracts/oc.base';

export const scalarBundle = baseOc
  .route({
    method: 'GET',
    path: '/vendor/scalar-api-reference.js',
    summary: 'Scalar API Reference Bundle',
    description: 'Serves the self-hosted Scalar standalone JavaScript bundle.',
    tags: ['Vendor'],
    outputStructure: 'detailed',
  })
  .output(
    z.object({
      headers: z.object({
        'content-type': z.literal('application/javascript; charset=utf-8'),
        'cache-control': z.literal('public, max-age=31536000, immutable'),
        'x-content-type-options': z.literal('nosniff'),
      }),
      body: z.instanceof(Blob),
    })
  );
