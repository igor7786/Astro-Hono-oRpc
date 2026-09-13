// src/server/hono-middleware/scalar.ts
import { Scalar } from '@scalar/hono-api-reference';

import { openApiBasePath } from '@/lib/helpers/paths';

const scalar = Scalar<{ Variables: { cspNonce: string } }>((c) => {
  const nonce = c.get('cspNonce');
  return {
    sources: [
      { url: `${openApiBasePath}/generate-schema`, title: 'App API' },
      // { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
    ],
    nonce,
    cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
    theme: 'fastify',
  };
});

export default scalar;
