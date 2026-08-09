import { baseOc } from '@/server/contracts/oc.base';
import { outputSchema } from '@/server/schemas/tests-schema/redirect.schema';
import { redirectSchema } from '@/server/schemas/tests-schema/redirect.schema';

const pathPrefix = '/redirects'; // ✅ added path prefix
export const redirectTest = baseOc
  .route({
    method: 'GET',
    path: pathPrefix, // ✅ added path
    description: 'If name is admin, redirect to root(/) code 301, else return code 200',
    summary: 'Redirect route',
    tags: ['Tests'],
    successDescription: 'Redirect route successful',
    outputStructure: 'detailed', // Allows 200 vs 307 conditional return
  })
  .input(redirectSchema)
  .output(outputSchema);
