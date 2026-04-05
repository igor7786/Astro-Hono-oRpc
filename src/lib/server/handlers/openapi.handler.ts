import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { SmartCoercionPlugin } from '@orpc/json-schema';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { onError, ORPCError } from '@orpc/server';
import { allRouters } from '@server/routers/all.routers';

const schemaConverters = [new ZodToJsonSchemaConverter()];

const openApiHandler = new OpenAPIHandler(allRouters, {
  interceptors: [
    onError((err) => {
      if (err instanceof ORPCError) {
        console.error('[oRPC Error]', err.status, err.code, err.message);
        return;
      }
      console.error('[Unexpected Error]', err);
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({ schemaConverters }),
    new OpenAPIReferencePlugin({
      schemaConverters,
      docsProvider: 'scalar',
      docsPath: '/orpc-docs',
      specPath: '/generate-schema',
      specGenerateOptions: {
        info: { title: 'My API', version: '1.0.0' },
        servers: [{ url: '/api/openapi' }],
        security: [{ cookieAuth: [] }], // ← cookie auth in spec
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'session', // ← Better Auth cookie name
            },
          },
        },
      },
    }),
  ],
});
export default openApiHandler;
