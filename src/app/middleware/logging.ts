// src/middleware/logging.ts
import { createMiddleware } from '@tanstack/react-start';

export const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  console.log('Global middleware intercepting function call...');

  // Proceed to next middleware or server function
  const result = await next();

  return result;
});
