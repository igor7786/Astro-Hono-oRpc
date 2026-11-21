import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

import { openApiPrefix } from '@/lib/helpers/paths/api.paths';
import { appContract } from '@/server/contracts/all.contracts';

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export async function generateOpenApiSchema() {
  return generator.generate(appContract, {
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
