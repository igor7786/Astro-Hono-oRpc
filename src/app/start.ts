// src/start.ts
import { createStart } from '@tanstack/react-start';

import { loggingMiddleware } from '@app/middleware/logging';

export const startInstance = createStart(() => {
  return {
    // Registers middleware to run before all requests (SSR, server functions, routes)
    requestMiddleware: [loggingMiddleware],
  };
});
