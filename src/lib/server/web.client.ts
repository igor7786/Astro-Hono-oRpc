// src/lib/server/web.client.ts
import { createORPCClient, onError, ORPCError } from '@orpc/client';
import type { ContractRouterClient } from '@orpc/contract';
import { ResponseValidationPlugin } from '@orpc/contract/plugins';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
// import type { AppRouter } from '@server/routers/all.routers';

// 1. You need the router/contract reference here
// If AppRouter is just a type, you might need to import the actual router object
// or the contract if you are using separate contracts.
import { appContract, type AppContract } from '@server/contracts/all.contracts';

const link = new OpenAPILink(appContract, {
  // <--- Added allRouters as 1st argument
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321'}/api/openapi`,

  fetch: async (url, init) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      return await fetch(url, {
        ...init,
        signal: controller.signal,
        credentials: 'include',
      });
    } finally {
      clearTimeout(timeout);
    }
  },
  plugins: [new ResponseValidationPlugin(appContract)],
  interceptors: [
    onError((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('[oRPC client] Request aborted by user', error);
        return;
      }
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

export const client: ContractRouterClient<AppContract> = createORPCClient(link);
export const clientOrpc = createTanstackQueryUtils(client);
