import { ogContract } from '@/server/contracts/og.contract';
import { slowTestContract, testContract } from '@/server/contracts/test.contract';

export const appContract = {
  test: testContract,
  testSlow: slowTestContract,
  og: ogContract,
};

export type AppContract = typeof appContract;
