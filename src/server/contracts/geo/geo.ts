import z from 'zod';

import { baseOc } from '@/server/contracts/oc.base';
import { geoSchema } from '@/server/schemas/geo';

export const geoContract = baseOc
  .route({
    method: 'GET',
    path: '/geo',
    description: 'This route is used only in production to get geo data.',
    summary: 'GEO Metadata',
    tags: ['GEO'],
    successDescription: 'GEO report processed successfully',
    successStatus: 200,
  })
  .input(z.object({}).strict())
  .output(geoSchema);
