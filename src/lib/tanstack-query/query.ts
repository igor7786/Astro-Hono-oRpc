// src/lib/tanstack-query/query.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { atom } from 'nanostores';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 60 * 24, // 24h — must be longer than maxAge
    },
  },
});
// Only run in browser — localStorage not available on server
if (typeof window !== 'undefined') {
  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: 'app:query-cache',
  });
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // cache valid for 24 hours
  });
}
export const $queryClient = atom(queryClient);
