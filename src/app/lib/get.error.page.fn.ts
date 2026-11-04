import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseStatus } from '@tanstack/react-start/server';

import { ErrorCodeSchema, errorContent } from '@/lib/shared/schemas/errors/page.errors';

// The route passes the code as a string. Anything not in ErrorCodeSchema becomes '404'.
export const getErrorPage = createServerFn({ method: 'GET' })
  .validator((input: unknown) => ErrorCodeSchema.catch('404').parse(input))
  .handler(async ({ data: code }) => {
    // Imported inside the handler so the env module never reaches the browser bundle
    const { envServer } = await import('@/lib/env/server.env');

    const { title, message } = errorContent[code];

    // Same as Astro.response.status = Number(code)
    setResponseStatus(Number(code));

    return {
      code,
      title,
      message,
      isServerError: code.startsWith('5'),
      requestId: getRequestHeader('x-request-id') ?? 'unavailable',
      href: envServer.PRODUCTION === 'true' ? envServer.PUBLIC_URL : '/',
    };
  });
