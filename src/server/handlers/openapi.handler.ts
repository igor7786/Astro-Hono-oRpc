import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { SmartCoercionPlugin } from '@orpc/json-schema';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { onError, ORPCError } from '@orpc/server';
import { allRouters } from '@/server/routers/all.routers';
import { ResponseHeadersPlugin } from '@orpc/server/plugins';

const schemaConverters = [new ZodToJsonSchemaConverter()];

const openApiHandler = new OpenAPIHandler(allRouters, {
  interceptors: [
    onError((err) => {
      if (err instanceof ORPCError) {
        console.error('[oRPC openapi]', err.status, err.code);
        return;
      }

      console.error('[oRPC openapi] unexpected error', err);
    }),
  ],

  plugins: [
    new ResponseHeadersPlugin(),
    new SmartCoercionPlugin({ schemaConverters }),
    new OpenAPIReferencePlugin({
      schemaConverters,
      docsProvider: 'scalar',
      docsPath: '/orpc-docs',
      specPath: '/generate-schema',
      specGenerateOptions: {
        info: { title: 'My API Docs', version: '1.0.0' },
        servers: [{ url: '/api/openapi' }],
        security: [{ cookieAuth: [] }],
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'session',
            },
          },
        },
      },
    }),
  ],
});

export default openApiHandler;
