// src/lib/llms.ts
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown';

export async function generateLLMsMarkdown(openApiDoc: any) {
  return await createMarkdownFromOpenApi(openApiDoc);
}
