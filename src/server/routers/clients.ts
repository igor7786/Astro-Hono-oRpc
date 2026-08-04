import { base } from '@/server/procedures/base';

export const ClientsRoute = base.tests.testClients.handler(async ({ context, errors }) => {
  return { status: 'ok' };
});
