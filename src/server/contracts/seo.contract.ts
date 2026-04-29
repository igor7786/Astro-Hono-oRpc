import { z } from 'zod';

import { seoQuerySchema } from '@/lib/shared/schemas/seo.schema';
import { baseOc } from '@/server/contracts/oc.base';

const pathPrefix = '/seo'; // ✅ added path prefix
export const og = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/og`, // ✅ added path
    description: 'Og image',
    summary: 'Generates og images',
    tags: ['SEO'],
    successDescription: 'Og image generated successfully',
    successStatus: 200,
    outputStructure: 'detailed',
  })
  .input(seoQuerySchema)
  .output(
    z.object({
      body: z.file(),
      headers: z.object({
        'Content-Type': z.string(),
        'Cache-Control': z.string(),
        'Content-Disposition': z.string(),
      }),
    })
  );

export const llmsHtml = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/llms.html`,
    description: 'LLMs Html',
    summary: 'Generates LLMs Html',
    tags: ['SEO'],
    successDescription: 'LLMs Html generated successfully',
    successStatus: 200,
    outputStructure: 'detailed',
  })
  .output(
    z.object({
      body: z.instanceof(Blob),
      headers: z.object({
        'Content-Type': z.string(),
        'Cache-Control': z.string(),
        'Content-Disposition': z.string(),
      }),
    })
  );
