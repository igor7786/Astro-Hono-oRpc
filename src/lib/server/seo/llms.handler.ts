import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown';
import { generateLLMsMarkdown } from '@server/seo/llms';
export async function htmlLlmsHandler(openApiHandler: any, env: any) {
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

  // 4. Return full HTML
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <title>Scalar Galaxy</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
</head>
<body>
  <main class="container">
    ${markdown}
  </main>
</body>
</html>`;
}
