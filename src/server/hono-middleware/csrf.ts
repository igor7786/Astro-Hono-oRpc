import { csrf } from 'hono/csrf';

const origin = [
  'https://fast-web-tech.co.uk',
  'https://www.fast-web-tech.co.uk',
  'http://localhost:4321',
  'http://localhost:4322',
];
export const csrfMiddleware = csrf({ origin });
