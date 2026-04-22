import { createRouterClient, onError, ORPCError } from '@orpc/server';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from '@/server/routers/all.routers';
import { allRouters } from '@/server/routers/all.routers';
import { envServer } from '@/lib/env/server.env';
export const serverClient: RouterClient<AppRouter> = createRouterClient(allRouters, {
  context: {
    env: envServer,
  },
  interceptors: [
    onError((error) => {
      if (!(error instanceof ORPCError)) {
        console.error('[oRPC Server] Unexpected error', error);
        return;
      }
      console.error(`[oRPC Server] ${error.code} - ${error.message}`);
      return;
    }),
  ],
});

export const serverOrpc = createTanstackQueryUtils(serverClient);
