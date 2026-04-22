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
<<<<<<< HEAD
        console.error('[oRPC Server] Unexpected error', error);
        return;
      }
      console.error(`[oRPC Server] ${error.code} - ${error.message}`);
      return;
=======
        console.error('[oRPC server] unexpected error', error);
        return;
      }

      console.error(`[oRPC server] ${error.code}`, error.message);
>>>>>>> 2b9afc0d9fe31d3670eb88983ab8d814b94d1e4b
    }),
  ],
});

export const serverOrpc = createTanstackQueryUtils(serverClient);
