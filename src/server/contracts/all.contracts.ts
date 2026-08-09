import { llmsHtml, llmsTxt, og } from '@/server/contracts/seo.contract';
import { testClients } from '@/server/contracts/tests-contracts/clients.contract';
import { redirectTest } from '@/server/contracts/tests-contracts/redirect.contract';
import { slowTest, test } from '@/server/contracts/tests-contracts/test.contract';

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
};

export type AppContract = typeof appContract;
