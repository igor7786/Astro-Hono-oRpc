import { base } from '@/server/procedures/base';
import { cspReportSchema } from '@/server/schemas/csp.report';

export const cspRoute = base.csp.cspReport.handler(async ({ input, errors }) => {
  let json: unknown;

  if (input.body instanceof Blob) {
    const text = await input.body.text();
    try {
      json = JSON.parse(text);
    } catch {
      throw errors.INPUT_VALIDATION_FAILED({
        message: 'JSON parse error ❌',
      });
    }
  } else {
    json = input.body;
  }

  const result = cspReportSchema.safeParse(json);
  if (!result.success) {
    console.warn('[CSP Report Invalid]', JSON.stringify(result.error.issues), json);
    throw errors.INPUT_VALIDATION_FAILED({
      message: 'Report failed schema validation ❌',
    });
  }

  console.warn('[CSP Violation]', JSON.stringify(result.data, null, 2));
  // TODO: pipe to Kafka/Redpanda topic

  return undefined;
});
