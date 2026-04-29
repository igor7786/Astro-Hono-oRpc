import { llmsRoute } from '@/server/routers/seo/llms.html';
import { llmsTxtRoute } from '@/server/routers/seo/llms.txt';
import { ogRoute } from '@/server/routers/seo/og';
import { slowTestRoute, testRoute } from '@/server/routers/test';

export const allRouters = {
  tests: {
    test: testRoute,
    slowTest: slowTestRoute,
  },
  seo: {
    ogRoute: ogRoute,
    llmsRoute: llmsRoute,
    llmsTxtRoute: llmsTxtRoute,
  },
};
export type AppRouter = typeof allRouters;
