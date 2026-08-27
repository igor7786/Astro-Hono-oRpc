import { envServer } from '@/lib/env/server.env';

export const allowedOrigins = [
  envServer.PUBLIC_URL,
  'https://www.fast-web-tech.co.uk',
  'http://localhost:4321',
  'http://localhost:4322',
] as const;
