import { baseOc } from '@/server/contracts/oc.base';
import {
  redirectInputSchema,
  redirectOutputSchema,
} from '@/server/schemas/tests-schema/redirect.schema';

export const redirectTest = baseOc
  .route({
    method: 'GET',
    path: '/tests/redirects',
    description: 'If name is admin, redirect to root(/) code 307, else return code 200',
    summary: 'Redirect route',
    tags: ['Tests'],
    successDescription: 'Redirect route successful',
    outputStructure: 'detailed',
  })
  .input(redirectInputSchema)
  .output(redirectOutputSchema);
