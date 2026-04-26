import { ogContract } from '@/server/contracts/seo.contract';
import { slowTestContract, testContract } from '@/server/contracts/test.contract';

export const appContract = {
  tests: {
    test: testContract,
    slowTest: slowTestContract, // ✅ fixed
  },
  seo: {
    ogRoute: ogContract, // ✅ fixed
  },
};

export type AppContract = typeof appContract;
