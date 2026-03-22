// src/lib/tanstack-query/query.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { get, set, del } from 'idb-keyval';

let queryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 3, // data fresh for 3 min
          gcTime: 1000 * 60 * 30, // keep in memory for 30 min
          retry: 1, // retry failed requests once
          refetchOnWindowFocus: false, // don't refetch on tab focus
          refetchOnReconnect: 'always', // always refetch on reconnect
          refetchOnMount: false, // don't refetch on component mount
        },
      },
    });

    // Only run in browser — IndexedDB not available on server
    if (typeof window !== 'undefined') {
      const persister = createAsyncStoragePersister({
        storage: {
          // IndexedDB via idb-keyval — 50MB+, async, non-blocking
          getItem: (key: string) => get(key),
          setItem: (key: string, value: string) => set(key, value),
          removeItem: (key: string) => del(key),
        },
        key: 'REACT_QUERY_CACHE',
        throttleTime: 1000, // throttle writes to IndexedDB (1 per second max)
      });

      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // cache valid for 24 hours
      });
    }
  }

  return queryClient;
};
