import { createORPCClient, onError, ORPCError } from '@orpc/client';
import { ResponseValidationPlugin } from '@orpc/contract/plugins';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

import { appContract } from '@/server/contracts/all.contracts';

import type { ContractRouterClient } from '@orpc/contract';
import type { JsonifiedClient } from '@orpc/openapi-client';

const link = new OpenAPILink(appContract, {
  // <--- Added allRouters as 1st argument
  url: () => `${window.location.origin}/api/rpc/openapi/v1`,
  eventIteratorKeepAliveEnabled: true,
  eventIteratorKeepAliveInterval: 5000,
  eventIteratorKeepAliveComment: '',

  fetch: async (url, init) => {
    return await fetch(url, {
      ...init,
      credentials: 'include',
    });
  },

  plugins: [new ResponseValidationPlugin(appContract)],
  interceptors: [
    onError((error) => {
      // Ignore expected request cancellations.
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      if (!(error instanceof ORPCError)) {
        console.error('[oRPC Client] Unexpected error', error);
        return;
      }

      console.error(`[oRPC Client] ${error.code} - ${error.message}`);
    }),
  ],
});

export const client: JsonifiedClient<ContractRouterClient<typeof appContract>> = createORPCClient(link);

export const clientOrpc = createTanstackQueryUtils(client);
