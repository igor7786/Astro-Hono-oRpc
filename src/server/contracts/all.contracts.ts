import { testClients } from '@/server/contracts/clients.contract';
import { llmsHtml, llmsTxt, og } from '@/server/contracts/seo.contract';
import { slowTest, test } from '@/server/contracts/test.contract';

export const appContract = {
  tests: {
    test,
    slowTest,
    testClients,
  },
  seo: {
    og,
    llmsHtml,
    llmsTxt,
  },
};

export type AppContract = typeof appContract;
