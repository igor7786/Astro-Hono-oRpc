import { generateLLMsMarkdown } from '@/lib/helpers/llms';
import { base } from '@/server/procedures/base';
import { generateOpenApiSchema } from '@/server/schemas/openapi.schema.generator';

export const llmsTxtRoute = base.seo.llmsTxt.handler(async ({ errors }) => {
  const openApiDoc = await generateOpenApiSchema().catch((_err) => {
    throw errors.BAD_REQUEST({ message: 'Failed to generate OpenAPI schema' });
  });
  const markdown = await generateLLMsMarkdown(openApiDoc).catch((_err) => {
    throw errors.BAD_REQUEST({ message: 'Failed to generate LLMs Markdown' });
  });

  return {
    body: new File([markdown as string], 'llms.txt', { type: 'text/plain' }),
    headers: {
      Vary: 'Accept',
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=360',
      'Content-Disposition': 'inline; filename="llms.txt"',
      'Content-Length': Buffer.byteLength(markdown as string).toString(),
    },
  };
});
