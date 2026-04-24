import { ogRoute } from '@/server/routers/files/og';
import { slowTestRoute, testRoute } from '@/server/routers/test';

export const allRouters = {
  test: testRoute,
  testSlow: slowTestRoute,
  og: ogRoute,
};
export type AppRouter = typeof allRouters;
