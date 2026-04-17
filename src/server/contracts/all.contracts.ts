import { testContract, slowTestContract } from '@/server/contracts/test.contract';

export const appContract = {
  test: testContract,
  testSlow: slowTestContract,
};

export type AppContract = typeof appContract;
