// src/server/contracts/test.contract.ts
import { baseOc } from '@/lib/server/contracts/oc.base';
import { testSchema } from '@server/schemas/test.schema';
export const testContract = baseOc
  .route({
    method: 'GET',
    path: '/test',
    description: 'Test route',
    summary: 'Test route summary',
    tags: ['Test'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);

export const slowTestContract = baseOc
  .route({
    method: 'POST',
    path: '/slow-test',
    description: 'Slow test route',
    summary: 'Slow test route summary',
    tags: ['Test'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);
