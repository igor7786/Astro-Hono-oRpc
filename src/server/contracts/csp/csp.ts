import z from 'zod';

import { baseOc } from '@/server/contracts/oc.base';

const ALLOWED_REPORT_TYPES = new Set([
  'application/csp-report',
  'application/reports+json',
  'application/json',
  'text/plain',
]);

export const cspReport = baseOc
  .route({
    method: 'POST',
    path: '/csp-report',
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
          'content-type': z
            .string()
            .transform((val) => val.split(';')[0]?.trim().toLowerCase() ?? '')
            .refine((mime) => ALLOWED_REPORT_TYPES.has(mime), {
              message:
                'Invalid Content-Type: expected application/csp-report, application/reports+json, application/json, or text/plain',
            }),
        })
        .loose(),
      // oRPC leaves application/csp-report as a Blob, but may pre-parse +json types
      body: z.union([z.instanceof(Blob), z.unknown()]),
    })
  )
  .output(z.void());
