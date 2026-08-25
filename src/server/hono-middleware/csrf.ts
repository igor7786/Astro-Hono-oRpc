import { csrf } from 'hono/csrf';

import { allowedOrigins } from '@/server/hono-middleware/allowed.origins';

export const csrfMiddleware = csrf({
  origin: (origin) => {
    // 2. Clean up incoming origin by stripping trailing slashes
    const cleanOrigin = origin?.replace(/\/$/, '');

    // 3. Return true if valid to allow, or false to reject the request
    return allowedOrigins.includes(cleanOrigin);
  },
});
