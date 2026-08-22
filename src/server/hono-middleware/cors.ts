// src/server/middleware/cors.ts
import { cors } from 'hono/cors';

import { envServer } from '@/lib/env/server.env';

const corsMiddleware = cors({
  origin: [envServer.PUBLIC_URL],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  exposeHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition'],
  maxAge: 600,
});

export default corsMiddleware;
