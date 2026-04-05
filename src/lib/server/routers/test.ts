// router.ts
import { base } from '@server/procedures/base';
import { testSchema } from '@server/schemas/test.schema';
// Define the Planet schema with metadata for OpenAPI

// GET route to list planets
export const testRoute = base
  .route({
    method: 'GET',
    path: '/test',
    description: 'Test route',
    summary: 'Test route summary',
    tags: ['Test'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema)
  .handler(async ({ input, context, errors }) => {
    const req = context.request;
    console.log('🟢 Procedure called — check where this prints!');
    console.log('Context request:', req?.url);

    if (input.name === 'admin') {
      throw errors.FORBIDDEN(); // uses default message
    }

    return { name: `Hello, ${input.name}!` };
  });

export const slowTestRoute = base
  .route({
    method: 'POST',
    path: '/slow-test',
    description: 'Slow test route',
    summary: 'Slow test route summary',
    tags: ['Test'],
    successDescription: 'Test route successful',
    successStatus: 200,
  })
  .input(testSchema)
  .output(testSchema)
  .handler(async ({ input, context, errors }) => {
    const signal = context.signal ?? context.request?.signal; // ← fallback

    console.log('signal:', signal);
    // Not working as expected in Bun
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => resolve(), 10000);

      signal?.addEventListener('abort', () => {
        console.log('🛑 abort fired!');
        clearTimeout(timeout);
        reject(errors.CLIENT_CLOSED_REQUEST());
      });
    });

    return { name: `Hello, ${input.name}!` };
  });
