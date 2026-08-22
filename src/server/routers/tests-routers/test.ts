import { setCookie } from '@orpc/server/helpers';

import { base } from '@/server/procedures/base';

export const testRoute = base.tests.test.handler(async ({ input, context, errors }) => {
  if (context.request) {
    context.resHeaders?.set('x-custom-header', 'Hello from oRPC!');
    setCookie(context.resHeaders, 'test', 'abc123', {
      secure: true,
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    });
  }
  // ✅ This now actually works
  if (input.name === 'admin') {
    throw errors.FORBIDDEN({ data: { redirect: false } }); // uses default message
  }
  return { name: `Hello, ${input.name}!` };
});

export const slowTestRoute = base.tests.slowTest.handler(async ({ input, context, errors }) => {
  const signal = context.signal;
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => resolve(), 6_000);

    signal?.addEventListener('abort', () => {
      console.log('🛑 abort fired!');
      clearTimeout(timeout);
      reject(errors.CLIENT_CLOSED_REQUEST());
    }); // poll every 100ms — cheap, plenty responsive for this
  });

  return { name: `Hello, ${input.name}!` };
});
