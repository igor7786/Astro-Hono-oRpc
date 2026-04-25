import { SmartCoercionPlugin } from '@orpc/json-schema';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { onError, ORPCError } from '@orpc/server';
import { ResponseHeadersPlugin } from '@orpc/server/plugins';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

import { openApiBasePath } from '@/lib/helpers/paths';
import { allRouters } from '@/server/routers/all.routers';

const schemaConverters = [new ZodToJsonSchemaConverter()];

const openApiHandler = new OpenAPIHandler(allRouters, {
  interceptors: [
    onError((err) => {
      if (err instanceof ORPCError) {
        console.error('[oRPC Openapi]', err.status, err.code);
        return;
      }

      console.error('[oRPC Openapi] unexpected error', err);
    }),
  ],

  plugins: [
    new ResponseHeadersPlugin(),
    new SmartCoercionPlugin({ schemaConverters }),
    new CORSPlugin({
      exposeHeaders: ['Content-Disposition'],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters,
      docsProvider: 'scalar',
      docsPath: '/orpc-docs',
      specPath: '/generate-schema',
      specGenerateOptions: {
        info: { title: 'My API Docs', version: '1.0.0' },
        servers: [{ url: openApiBasePath }],
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
