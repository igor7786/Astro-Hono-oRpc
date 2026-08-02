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
    throw errors.FORBIDDEN(); // uses default message
  }
  const signal = context.request?.signal;
  console.log('signal?.aborted', signal?.aborted);
  if (signal?.aborted) {
    throw errors.CLIENT_CLOSED_REQUEST();
  }
  return { name: `Hello, ${input.name}!` };
});

export const slowTestRoute = base.tests.slowTest.handler(async ({ input, context, errors }) => {
  const signal = context.signal;
  await new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      console.log('signal?.aborted', signal?.aborted);
      if (signal?.aborted) {
        clearInterval(interval);
        console.log('🛑 abort detected via polling');
        reject(errors.CLIENT_CLOSED_REQUEST());
        return;
      }
      if (Date.now() - start >= 6_000) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // poll every 100ms — cheap, plenty responsive for this
  });

  return { name: `Hello, ${input.name}!` };
});
