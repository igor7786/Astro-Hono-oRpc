import { envClient } from '@/lib/env/client.env';
import { baseOc } from '@/server/contracts/oc.base';
import {
  llmsHtmlOutputSchema,
  llmsTxtOutputSchema,
  ogIdTokenSchema,
  outputOgSchema,
} from '@/server/schemas/seo.og.html.txt';

const pathPrefix = '/seo'; // ✅ added path prefix
export const og = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/og${envClient.PUBLIC_API_VERSION}`, // ✅ added path
    summary: 'Generates og images',
    description: 'Og image',
    tags: ['SEO'],
    successDescription: 'Og image generated successfully',
    successStatus: 200,
    outputStructure: 'detailed',
  })
  .input(ogIdTokenSchema)
  .output(outputOgSchema);

export const llmsHtml = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/llms.html`,
    summary: 'Generates LLMs Html',
    description: 'LLMs Html',
    tags: ['SEO'],
    successDescription: 'LLMs Html generated successfully',
    successStatus: 200,
    outputStructure: 'detailed',
  })
  .output(llmsHtmlOutputSchema);
export const llmsTxt = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/llms.txt`,
    summary: 'Generates LLMs Text',
    description: 'LLMs Text',
    tags: ['SEO'],
    successDescription: 'LLMs Text generated successfully',
    successStatus: 200,
    outputStructure: 'detailed',
  })
  .output(llmsTxtOutputSchema);
