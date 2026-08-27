import { z } from 'zod';

export const CspReportEntrySchema = z.object({
  'document-uri': z.string(),
  referrer: z.string().optional().default(''),
  'violated-directive': z.string(),
  'effective-directive': z.string().optional(),
  'original-policy': z.string(),
  disposition: z.enum(['enforce', 'report']),
  'blocked-uri': z.string(),
  'line-number': z.number().optional(),
  'column-number': z.number().optional(),
  'source-file': z.string().optional(),
  'status-code': z.number().optional(),
  'script-sample': z.string().optional(),
});

export const cspReportSchema = z.object({
  'csp-report': CspReportEntrySchema,
});

export type CspReport = z.infer<typeof cspReportSchema>;
