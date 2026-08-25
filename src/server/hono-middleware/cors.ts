// src/server/middleware/cors.ts
import { cors } from 'hono/cors';

import { allowedOrigins } from '@/server/hono-middleware/allowed.origins';

const corsMiddleware = cors({
  origin: (origin) => {
    // Normalize trailing slashes to prevent string mismatch bugs
    const cleanOrigin = origin?.replace(/\/$/, '');

    // ✅ If allowed, return the explicit origin string to pass CORS
    if (allowedOrigins.includes(cleanOrigin)) {
      return origin;
    }

    // ❌ Explicitly return null to block the cross-site request
    return null;
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  exposeHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition'],
  maxAge: 600,
});

export default corsMiddleware;
