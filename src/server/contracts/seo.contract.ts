import { z } from 'zod';

import { seoQuerySchema } from '@/lib/shared/schemas/seo.schema';
import { baseOc } from '@/server/contracts/oc.base';

const pathPrefix = '/seo'; // ✅ added path prefix
export const ogContract = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/og`,
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
      }),
    })
  );
