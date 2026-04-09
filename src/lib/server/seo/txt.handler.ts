import { generateLLMsMarkdown } from '@server/seo/llms';

export async function llmsTxtHandler(openApiHandler: any, env: any) {
  // 1. Get OpenAPI schema
  const { response } = await openApiHandler.handle(
    new Request('http://internal/api/openapi/generate-schema'),
    {
      prefix: '/api/openapi',
      context: { env },
    }
  );

  if (!response) {
    throw new Error('OpenAPI handler did not return a response');
  }

  // 2. Parse JSON
  const openApiDoc = await response.json();

  // 3. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);

  return markdown;
}
