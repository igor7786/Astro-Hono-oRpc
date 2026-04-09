import { generateLLMsMarkdown } from '@server/seo/llms';
import { generateOpenApiSchema } from '../schemas/oenapi.schema';

export async function llmsTxtHandler() {
  // 1. Get OpenAPI schema
  const openApiDoc = await generateOpenApiSchema();

  // 2. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);

  return markdown;
}
