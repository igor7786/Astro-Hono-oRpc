import { ogRoute } from '@/server/routers/seo/og';
import { slowTestRoute, testRoute } from '@/server/routers/test';

export const allRouters = {
  tests: {
    test: testRoute,
    slowTest: slowTestRoute,
  },
  seo: {
    ogRoute: ogRoute,
  },
};
export type AppRouter = typeof allRouters;
