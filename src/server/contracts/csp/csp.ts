import z from 'zod';

import { baseOc } from '@/server/contracts/oc.base';
import { cspReportSchema } from '@/server/schemas/csp.report';

export const cspReport = baseOc
  .route({
    method: 'POST',
    path: `/csp`, // ✅ added path
    description: 'This route is used when CSP report is sent. When CSP fails, it will be sent here.',
    summary: 'CSP Report',
    tags: ['CSP'],
    successDescription: 'Test SSE clients route successful',
    successStatus: 204,
  })
  .input(cspReportSchema)
  .output(z.void());
