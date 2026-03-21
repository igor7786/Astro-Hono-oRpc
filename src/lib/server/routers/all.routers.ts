// src/server/router.ts
import { testRoute } from '@server/routers/test';
export const allRouters = {
  test: testRoute,
};
export type AppRouter = typeof allRouters;
