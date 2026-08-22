import { Scalar } from '@scalar/hono-api-reference';

const scalar = Scalar({
  sources: [
    { url: '/api/openapi/generate-schema', title: 'App API' },
    { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
  ],
});

export default scalar;
