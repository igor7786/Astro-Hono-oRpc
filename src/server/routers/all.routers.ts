import { llmsRoute } from '@/server/routers/seo/llms.html';
import { llmsTxtRoute } from '@/server/routers/seo/llms.txt';
import { ogRoute } from '@/server/routers/seo/og';
import { ClientsRoute } from '@/server/routers/tests-routers/clients';
import { testRedirect } from '@/server/routers/tests-routers/redirect';
import { slowTestRoute, testRoute } from '@/server/routers/tests-routers/test';

export const allRouters = {
  tests: {
    test: testRoute,
    slowTest: slowTestRoute,
    testClients: ClientsRoute,
    redirectTest: testRedirect,
  },
  seo: {
    ogRoute: ogRoute,
    llmsRoute: llmsRoute,
    llmsTxtRoute: llmsTxtRoute,
  },
};
export type AppRouter = typeof allRouters;
