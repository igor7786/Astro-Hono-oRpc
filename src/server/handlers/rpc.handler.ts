import { RPCHandler } from '@orpc/server/fetch';
import { ORPCError } from '@orpc/server';
import { allRouters } from '@/server/routers/all.routers';

const rpcHandler = new RPCHandler(allRouters, {
  interceptors: [
    // ✅ HTTP level — first line of defense
    async ({ request, next }) => {
      const signal = request?.signal;

      if (signal?.aborted) {
        throw new ORPCError('CLIENT_CLOSED_REQUEST', {
          // ← consistent with base
          message: 'Client closed the request',
        });
      }

      signal?.addEventListener('abort', () => {
        console.log(`[oRPC] Client closed the request: ${request?.url}`);
      });

      return next();
    },
  ],
});

export default rpcHandler;
