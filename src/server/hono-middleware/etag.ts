import { etag } from 'hono/etag';
import { createMiddleware } from 'hono/factory';

// Paths that stream their response — ETag needs to buffer the full body to
// hash it, which defeats streaming (and can break/hang the response), so
// these are skipped entirely.
const STREAMING_PATH_SEGMENTS = [
  'clients',
  // add more streaming path segments here as they come up
];

const etagMiddleware = createMiddleware(async (c, next) => {
  const m = c.req.method;
  if (m !== 'GET' && m !== 'HEAD') return next();
  if (STREAMING_PATH_SEGMENTS.some((p) => c.req.path.includes(p))) return next();
  return etag({ weak: true })(c, next);
});

export default etagMiddleware;
