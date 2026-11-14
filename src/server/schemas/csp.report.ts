import { z } from 'zod';

// 1. Legacy report-uri format (Content-Type: application/csp-report)
export const CspReportEntrySchema = z
  .object({
    'document-uri': z.string(),
    referrer: z.string().nullable().optional().default(''),
    'violated-directive': z.string(),
    'effective-directive': z.string().optional(),
    'original-policy': z.string(),
    disposition: z.enum(['enforce', 'report']),
    'blocked-uri': z.string(),
    'line-number': z.number().optional(),
    'column-number': z.number().optional(),
    'source-file': z.string().nullable().optional(),
    'status-code': z.number().optional(),
    'script-sample': z.string().nullable().optional(),
  })
  .loose();

export const LegacyCspReportSchema = z.object({
  'csp-report': CspReportEntrySchema,
});

// 2. Modern Reporting API / report-to format (Content-Type: application/reports+json)
export const ModernCspReportBodySchema = z
  .object({
    documentURL: z.string(),
    blockedURL: z.string().nullable().optional(),
    referrer: z.string().nullable().optional(),
    effectiveDirective: z.string(),
    originalPolicy: z.string(),
    sourceFile: z.string().nullable().optional(),
    sample: z.string().nullable().optional(),
    disposition: z.enum(['enforce', 'report']),
    statusCode: z.number().optional(),
    lineNumber: z.number().optional(),
    columnNumber: z.number().optional(),
  })
  .loose();

export const ModernCspReportItemSchema = z
  .object({
    age: z.number().optional(),
    type: z.literal('csp-violation'),
    url: z.string(),
    user_agent: z.string().optional(),
    body: ModernCspReportBodySchema,
  })
  .loose();

export const cspReportSchema = z.union([
  LegacyCspReportSchema,
  z.array(ModernCspReportItemSchema).min(1),
]);

export type CspReport = z.infer<typeof cspReportSchema>;
