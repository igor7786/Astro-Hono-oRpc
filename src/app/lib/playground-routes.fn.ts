// src/app/lib/playground-routes.fn.ts
import { createServerFn } from '@tanstack/react-start';

import type { Route } from '@/lib/helpers/paths';

import type { RouteItem } from '@app/components/RouteListCard';

export type PlaygroundData = {
  ssrRoutes: Route[];
  staticRoutes: Route[];
  adminRoutes: RouteItem[];
};

const empty: PlaygroundData = { ssrRoutes: [], staticRoutes: [], adminRoutes: [] };

export const getPlaygroundRoutes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PlaygroundData> => {
    // Call our own server directly instead of going back out through the proxy
    const port = process.env.PORT ?? '4321';

    try {
      const res = await fetch(`http://127.0.0.1:${port}/playground/routes.json`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error(`routes.json responded ${res.status}`);
      return (await res.json()) as PlaygroundData;
    } catch (error) {
      // Don't take the whole page down if the list can't load
      console.error('[playground] could not load routes.json:', error);
      return empty;
    }
  }
);
