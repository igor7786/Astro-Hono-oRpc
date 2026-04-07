import { setCookie } from '@orpc/server/helpers';
import { base } from '@server/procedures/base';

export const testRoute = base.test.handler(async ({ input, context, errors }) => {
  if (context.request) {
    context.resHeaders?.set('x-custom-header', 'Hello from oRPC!');
    setCookie(context.resHeaders, 'test', 'abc123', {
      secure: true,
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    });
    console.log('Request called on Client');
  } else {
    console.log('Request called on Server');
  }
  // ✅ This now actually works
  if (input.name === 'admin') {
    throw errors.FORBIDDEN(); // uses default message
  }
  return { name: `Hello, ${input.name}!` };
});

export const slowTestRoute = base.testSlow.handler(async ({ input, context, errors }) => {
  const signal = context.signal ?? context.request?.signal; // ← fallback
  // Not working as expected in Bun
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => resolve(), 3000);

    signal?.addEventListener('abort', () => {
      console.log('🛑 abort fired!');
      clearTimeout(timeout);
      reject(errors.CLIENT_CLOSED_REQUEST());
    });
  });

  return { name: `Hello, ${input.name}!` };
});
