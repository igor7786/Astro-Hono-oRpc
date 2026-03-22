import { RPCHandler } from '@orpc/server/fetch';
import { allRouters } from '@server/routers/all.routers';
// ✅ RPC handler — used by your TypeScript client (full types)
const rpcHandler = new RPCHandler(allRouters);
export default rpcHandler;
