import { base } from '@/server/procedures/base';
import { cspReportSchema } from '@/server/schemas/csp.report';

export const cspRoute = base.csp.cspReport.handler(async ({ input, errors }) => {
  const text = await input.body.text();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw errors.INPUT_VALIDATION_FAILED({
      message: 'JSON parse error ❌',
    });
  }

  const result = cspReportSchema.safeParse(json);
  if (!result.success) {
    throw errors.INPUT_VALIDATION_FAILED({
      message: 'Report failed schema validation ❌',
    });
  }

  console.warn('[CSP Violation]', JSON.stringify(result.data, null, 2));
  // TODO: pipe to Kafka/Redpanda topic

  return undefined;
});
