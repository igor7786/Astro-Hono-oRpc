// src/lib/server/web.client.ts
import { createORPCClient, onError, ORPCError } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@server/routers/all.routers';

const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321'}/api/rpc`,

  fetch: (url, init) =>
    fetch(url, {
      ...init,
      credentials: 'include',
    }),

  interceptors: [
    onError((error) => {
      if (!(error instanceof ORPCError)) {
        console.error('[oRPC client] Unexpected error', error);
        return;
      }

      console.error(`[oRPC client] ${error.code} - ${error.message}`);

      if (error.code === 'UNAUTHORIZED') {
        window.location.href = '/login';
        return;
      }

      if (error.code === 'FORBIDDEN') {
        window.location.href = '/403';
        return;
      }
    }),
  ],
});

export const client: RouterClient<AppRouter> = createORPCClient(link);
export const clientOrpc = createTanstackQueryUtils(client);
