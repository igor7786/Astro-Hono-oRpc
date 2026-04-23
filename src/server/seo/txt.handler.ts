import { Hono } from 'hono';

import { envServer } from '@/lib/env/server.env';
import { generateLLMsMarkdown } from '@/server/seo/llms';

export const llmsTxt = new Hono();
export async function llmsTxtHandler() {
  // 1. Get OpenAPI schema
  // ✅ fetch real schema endpoint
  const res = await fetch(`${envServer.PUBLIC_URL}/api/openapi/generate-schema`);
  const openApiDoc = await res.json();
  // 2. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);

  return markdown;
}

llmsTxt.get('/llms.txt', async (c) => {
  const markdown = await llmsTxtHandler();

  return c.text(markdown, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });
});
