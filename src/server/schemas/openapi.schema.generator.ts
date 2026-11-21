import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

import { openApiPrefix } from '@/lib/helpers/paths/api.paths';
import { allRouters } from '@/server/routers/all.routers';

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export async function generateOpenApiSchema() {
  return generator.generate(allRouters, {
    info: {
      title: 'My API Docs',
      version: '1.0.0',
    },
    servers: [{ url: openApiPrefix }],
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
  });
}
