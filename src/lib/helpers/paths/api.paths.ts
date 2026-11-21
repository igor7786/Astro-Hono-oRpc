import { envClient } from '@/lib/env/client.env';
import { appContract } from '@/server/contracts/all.contracts';

export const ogPath = appContract.seo.og['~orpc'].route.path; // derived from router definition
export const cspPath = appContract.csp.cspReport['~orpc'].route.path; // derived from router definition
export const scalarDocsPath = appContract.vendor.scalarBundle['~orpc'].route.path;

const rawPrefix = envClient.PUBLIC_OPEN_API_BASE_PATH;
export const openApiPrefix: `/${string}` = rawPrefix.startsWith('/')
  ? (rawPrefix as `/${string}`)
  : `/${rawPrefix}`;
