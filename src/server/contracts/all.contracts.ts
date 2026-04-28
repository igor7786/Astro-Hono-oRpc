import { llmsHtml, og } from '@/server/contracts/seo.contract';
import { slowTest, test } from '@/server/contracts/test.contract';

export const appContract = {
  tests: {
    test,
    slowTest,
  },
  seo: {
    og, // ✅ fixed
    llmsHtml, // ✅ fixed
  },
};

export type AppContract = typeof appContract;
