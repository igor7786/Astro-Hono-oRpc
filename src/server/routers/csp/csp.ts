import { base } from '@/server/procedures/base';

export const cspRoute = base.csp.cspReport.handler(async ({ input }) => {
  console.warn('[CSP Violation]', JSON.stringify(input, null, 2));
  // TODO: pipe to Kafka/Redpanda topic, or wherever you want these logged

  return undefined; // matches z.void(), pairs cleanly with 204
});
