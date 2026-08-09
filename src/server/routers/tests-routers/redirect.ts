import { base } from '@/server/procedures/base';

export const testRedirect = base.tests.redirectTest.handler(async ({ input, context }) => {
  if (input.name === 'admin') {
    return {
      status: 301,
      headers: { location: '/' },
    };
  }
  return {
    status: 200,
    body: {
      name: `Hello, ${input.name}!`,
    },
  };
});
