import { slowTestRoute, testRoute } from '@/server/routers/test';
export const allRouters = {
  test: testRoute,
  testSlow: slowTestRoute,
};
export type AppRouter = typeof allRouters;
