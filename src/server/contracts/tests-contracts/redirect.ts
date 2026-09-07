import { envClient } from '@/lib/env/client.env';
import { baseOc } from '@/server/contracts/oc.base';
import { redirectOutputSchema } from '@/server/schemas/tests-schema/redirect.schema';
import { redirectInputSchema } from '@/server/schemas/tests-schema/redirect.schema';

export const redirectTest = baseOc
  .route({
    method: 'GET',
    path: `/tests/redirects${envClient.PUBLIC_API_VERSION}`, // ✅ added path
    description: 'If name is admin, redirect to root(/) code 301, else return code 200',
    summary: 'Redirect route',
    tags: ['Tests'],
    successDescription: 'Redirect route successful',
    outputStructure: 'detailed',
  })
  .input(redirectInputSchema)
  .output(redirectOutputSchema);
