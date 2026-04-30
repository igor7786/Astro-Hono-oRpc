import { generateLLMsMarkdown } from '@/lib/helpers/llms';
import { base } from '@/server/procedures/base';
import { generateOpenApiSchema } from '@/server/schemas/oenapi.schema.generator';

export const llmsRoute = base.seo.llmsHtml.handler(async ({ errors }) => {
  const html = await htmlLlmsHandler().catch((_err) => {
    throw errors.INTERNAL_SERVER_ERROR({ message: 'Failed to parse HTML' });
  });

  return {
    body: new Blob([html], { type: 'text/html' }),
    headers: {
      Vary: 'Accept',
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=360',
      'Content-Disposition': 'inline; filename="llms.html"',
      'Content-Length': Buffer.byteLength(html).toString(),
    },
  };
});

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
  <link rel="stylesheet" href="/llms.css" />
</head>
<body class="bg-gray-950 text-gray-100">
    <main class="prose prose-invert mx-auto max-w-3xl p-6">
      ${markdown}
    </main>
</body>
</html>`;
}
