import { createORPCClient, onError, ORPCError } from '@orpc/client';
import type { ContractRouterClient } from '@orpc/contract';
import { ResponseValidationPlugin } from '@orpc/contract/plugins';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

// 1. You need the contract reference here
// If AppRouter is just a type, you might need to import the actual router object
// or the contract if you are using separate contracts.
import { appContract, type AppContract } from '@/server/contracts/all.contracts';

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
        // ❌ do NOT log abort in production
        return;
      }

      if (!(error instanceof ORPCError)) {
        console.error('[oRPC client] unexpected error', error);
        return;
      }

      console.error(`[oRPC client] ${error.code}`);

      if (error.code === 'UNAUTHORIZED') {
        window.location.href = '/login';
      }

      if (error.code === 'FORBIDDEN') {
        window.location.href = '/403';
      }
    }),
  ],
});

export const client: ContractRouterClient<AppContract> = createORPCClient(link);
export const clientOrpc = createTanstackQueryUtils(client);
