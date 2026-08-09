import { eventIterator } from '@orpc/server';

import { baseOc } from '@/server/contracts/oc.base';
import { testClientSchema } from '@/server/schemas/clients.schema';

const pathPrefix = '/tests'; // ✅ added path prefix
export const testClients = baseOc
  .route({
    method: 'GET',
    path: `${pathPrefix}/clients`, // ✅ added path
    description:
      'This route is used to test the clients SSE (SQLite, PostgreSQL, S3, Kafka, Redis ...) functionality as well as the server response. It is designed to ensure that the all clients can successfully communicate with the server and receive the expected data.',
    summary: 'Clients test SSE (SQlite, Postgres, Redis, .....)',
    tags: ['Tests'],
    successDescription: 'Test SSE clients route successful',
    successStatus: 200,
  })
  .output(eventIterator(testClientSchema));
