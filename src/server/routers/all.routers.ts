import { os } from '@orpc/server';

import { ogRoute } from '@/server/routers/seo/og';
import { slowTestRoute, testRoute } from '@/server/routers/test';

const testPath = os.prefix('/all-test').router({
  test: testRoute,
  slowTest: slowTestRoute,
});
const seoPath = os.prefix('/seo').router({
  ogRoute,
});

export const allRouters = {
  testPath,
  seoPath,
};
export type AppRouter = typeof allRouters;
