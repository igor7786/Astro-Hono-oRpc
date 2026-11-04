import { createServerFn } from '@tanstack/react-start';

import { discoverRoutes } from '@/lib/helpers/paths';

export const getPlaygroundRoutes = createServerFn({
  method: 'GET',
}).handler(async () => {
  const raw = import.meta.glob(
    ['/src/pages/**/*.{astro,ts,tsx,js,jsx}', '!/src/pages/playground/routes.json.ts'],
    { eager: true }
  );

  const allFiles = Object.fromEntries(
    Object.entries(raw).map(([key, mod]) => [key.replace('/src/pages/', './'), mod])
  );

  const tanstackFiles = import.meta.glob('/src/app/routes/**/*.{ts,tsx}');

  const { ssrRoutes, staticRoutes } = await discoverRoutes(allFiles, tanstackFiles);

  return {
    ssrRoutes,
    staticRoutes,
  };
});
