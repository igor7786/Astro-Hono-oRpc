import { base } from '@/server/procedures/base';

export const testRedirect = base.tests.redirectTest.handler(async ({ input }) => {
  // Condition A: Triggers the 301 redirect
  if (input.name === 'admin') {
    return {
      status: 307,
      headers: {
        location: '/auth/login',
      },
    };
  }
  return {
    status: 200,
    body: {
      name: `Hello, ${input.name}!`,
    },
  };
});
