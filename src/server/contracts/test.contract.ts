import { baseOc } from '@/server/contracts/oc.base';
import { testSchema } from '@/server/schemas/test.schema';

const pathPrefix = '/all-tests'; // ✅ added path prefix
export const testContract = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/test`,
    description: 'Test route',
    summary: 'Test route summary',
    tags: ['Tests'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);

export const slowTestContract = baseOc
  .route({
    method: 'POST',
    path: `${pathPrefix}/slow-test`,
    description: 'Slow test route',
    summary: 'Slow test route summary',
    tags: ['Tests'],
    successDescription: 'Slow test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);
