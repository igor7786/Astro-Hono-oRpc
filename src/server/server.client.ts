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
        console.log('[oRPC server] Unexpected error', error);
        return;
      }
      console.log(`[oRPC server] ${error.code} - ${error.message}`);
      return;
    }),
  ],
});

export const serverOrpc = createTanstackQueryUtils(serverClient);
