import { envClient } from '@/lib/env/client.env';
import { baseOc } from '@/server/contracts/oc.base';
import { testSchema } from '@/server/schemas/tests-schema/test.schema';

const pathPrefix = '/tests'; // ✅ added path prefix
export const test = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/test${envClient.PUBLIC_API_VERSION}`, // ✅ added path
    summary: 'Dummy test',
    description: 'Returning query params , name and sets cookie dummy cookie abc123',
    tags: ['Tests'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);

export const slowTest = baseOc
  .route({
    method: 'POST',
    path: `${pathPrefix}/slow-test${envClient.PUBLIC_API_VERSION}`, // ✅ added path
    description: 'Slow test route, sleeps for 6 seconds',
    summary: 'Slow test',
    tags: ['Tests'],
    successDescription: 'Slow test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema);
