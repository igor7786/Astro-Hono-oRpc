import { RPCHandler } from '@orpc/server/fetch';
import { ORPCError } from '@orpc/server';
import { allRouters } from '@/server/routers/all.routers';

const rpcHandler = new RPCHandler(allRouters, {
  interceptors: [
    // ✅ HTTP level — first line of defence
    async ({ request, next }) => {
      const signal = request?.signal;

      if (signal?.aborted) {
        throw new ORPCError('CLIENT_CLOSED_REQUEST', {
          // ← consistent with base
          message: 'Client closed the request',
        });
      }
      return next();
    },
  ],
});

export default rpcHandler;
