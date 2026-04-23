import { Hono } from 'hono';

import { generateOpenApiSchema } from '@/server/schemas/oenapi.schema.generator';
import { generateLLMsMarkdown } from '@/server/seo/llms';

export const llmsHtml = new Hono();

export async function htmlLlmsHandler() {
  // 1. Get OpenAPI schema
  const openApiDoc = await generateOpenApiSchema();
  // 2. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);
  // 3. Return full HTML
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <title>Api Docs in Markdown</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
</head>
<body>
  <main class="container" id="llms-markdown">
    ${markdown}
  </main>
</body>
</html>`;
}

llmsHtml.get('/llms.html', async (c) => {
  const html = await htmlLlmsHandler();
  return c.html(html);
});
