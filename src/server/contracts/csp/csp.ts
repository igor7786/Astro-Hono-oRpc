import z from 'zod';

import { baseOc } from '@/server/contracts/oc.base';

export const cspReport = baseOc
  .route({
    method: 'POST',
    path: `/csp`,
    description: 'This route is used when CSP report is sent. When CSP fails, it will be sent here.',
    summary: 'CSP Report',
    tags: ['CSP'],
    successDescription: 'CSP report received',
    successStatus: 204,
    inputStructure: 'detailed',
  })
  .input(
    z.object({
      headers: z
        .object({
          'content-type': z.enum(['application/csp-report', 'text/plain']),
        })
        .loose(),
      body: z.instanceof(Blob), // ✅ accept raw text, whatever the content-type
    })
  )
  .output(z.void());
