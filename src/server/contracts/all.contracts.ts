import { cspReport } from '@/server/contracts/csp/csp';
import { llmsHtml, llmsTxt, og } from '@/server/contracts/seo/seo';
import { testClients } from '@/server/contracts/tests-contracts/clients';
import { redirectTest } from '@/server/contracts/tests-contracts/redirect';
import { slowTest, test } from '@/server/contracts/tests-contracts/test';

export const appContract = {
  tests: {
    test,
    slowTest,
    testClients,
    redirectTest,
  },
  seo: {
    og,
    llmsHtml,
    llmsTxt,
  },
  csp: {
    cspReport,
  },
};

export type AppContract = typeof appContract;
