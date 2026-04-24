import { ogRoute } from '@/server/routers/seo/og';
import { slowTestRoute, testRoute } from '@/server/routers/test';

export const allRouters = {
  test: testRoute,
  testSlow: slowTestRoute,
  seo: {
    og: ogRoute,
  },
};
export type AppRouter = typeof allRouters;
