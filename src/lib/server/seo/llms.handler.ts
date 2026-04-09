import { generateLLMsMarkdown } from '@server/seo/llms';
import { generateOpenApiSchema } from '../schemas/oenapi.schema';
export async function htmlLlmsHandler() {
  // 1. Get OpenAPI schema
  const openApiDoc = await generateOpenApiSchema();
  // 2. Convert to Markdown
  const markdown = await generateLLMsMarkdown(openApiDoc);
  // 3. Return full HTML
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
