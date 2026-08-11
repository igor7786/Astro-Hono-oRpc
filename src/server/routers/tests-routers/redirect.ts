import { base } from '@/server/procedures/base';

export const testRedirect = base.tests.redirectTest.handler(async ({ input, errors }) => {
  if (input.name === 'admin') {
    // Pass custom fields directly within the typed data payload wrapper
    throw errors.REDIRECT_REQUEST({
      message: 'Redirecting to home',
      data: {
        url: '/',
      },
    });
  }
  return {
    name: `Hello, ${input.name}!`,
  };
});
