import { ogContract } from '@/server/contracts/seo.contract';
import { slowTestContract, testContract } from '@/server/contracts/test.contract';

export const appContract = {
  test: testContract,
  testSlow: slowTestContract,
  seo: { og: ogContract },
};

export type AppContract = typeof appContract;
