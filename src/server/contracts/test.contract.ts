import { baseOc } from '@/server/contracts/oc.base';
import { testSchema } from '@/server/schemas/test.schema';

export const test = baseOc
  .route({
    method: 'GET',
    description: 'Test route',
    summary: 'Test route summary',
    tags: ['Tests'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);

export const slowTest = baseOc
  .route({
    method: 'POST',
    description: 'Slow test route',
    summary: 'Slow test route summary',
    tags: ['Tests'],
    successDescription: 'Slow test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);
