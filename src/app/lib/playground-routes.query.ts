// src/app/lib/playground-routes.query.ts
import { queryOptions } from '@tanstack/react-query';

import { getPlaygroundRoutes } from '@app/lib/playground-routes.fn';

export const playgroundRoutesQuery = queryOptions({
  queryKey: ['playground', 'routes'],
  queryFn: () => getPlaygroundRoutes(),
  staleTime: 5 * 60_000, // the list only changes on deploy, so don't refetch on every navigation
});
