import { createORPCClient, onError, ORPCError } from '@orpc/client';
import type { ContractRouterClient } from '@orpc/contract';
import { ResponseValidationPlugin } from '@orpc/contract/plugins';
import type { JsonifiedClient } from '@orpc/openapi-client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

// 1. You need the contract reference here
// If AppRouter is just a type, you might need to import the actual router object
// or the contract if you are using separate contracts.
import { type AppContract, appContract } from '@/server/contracts/all.contracts';

const link = new OpenAPILink(appContract, {
  // <--- Added allRouters as 1st argument
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321'}/api/openapi`,

  fetch: async (url, init) => {
    return await fetch(url, {
      ...init,
      credentials: 'include',
    });
  },

  plugins: [new ResponseValidationPlugin(appContract)],
  interceptors: [
    onError((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('[oRPC Client] Request aborted by user', error);
        return;
      }
      if (!(error instanceof ORPCError)) {
        console.error('[oRPC Client] Unexpected error', error);
        return;
      }

      console.error(`[oRPC Client] ${error.code} - ${error.message}`);

      if (error.code === 'REDIRECT_REQUEST') {
        // Extract the destination string safely from our typed error payload
        const rawUrl = (error.data as { url?: string })?.url;
        const targetUrl = rawUrl && rawUrl.startsWith('/') && !rawUrl.startsWith('//') ? rawUrl : '/';
        console.warn(`Redirect intercepted! Navigating to: ${targetUrl}`);
        // 2. Instruct the browser to redirect
        // navigate(targetUrl);
        window.location.replace(targetUrl);
      }
    }),
  ],
});

export const client: JsonifiedClient<ContractRouterClient<AppContract>> = createORPCClient(link);
export const clientOrpc = createTanstackQueryUtils(client);
