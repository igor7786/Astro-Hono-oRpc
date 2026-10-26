import fs from 'node:fs';

import { minifyContractRouter } from '@orpc/contract';

import { allRouters } from '@/server/routers/all.routers';

const minifiedRouter = minifyContractRouter(allRouters);

fs.writeFileSync('./src/server/contracts/helpers/contract.json', JSON.stringify(minifiedRouter));
console.log('✅ Generated contract.json');
