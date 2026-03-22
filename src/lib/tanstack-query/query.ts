// src/lib/tanstack-query/query.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

let queryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 3,
          gcTime: 1000 * 60 * 30,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: 'always',
          refetchOnMount: false,
        },
      },
    });

    if (typeof window !== 'undefined') {
      const persister = createAsyncStoragePersister({
        storage: window.localStorage,
        key: 'REACT_QUERY_OFFLINE_CACHE',
        throttleTime: 1000,
      });

      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      });
    }
  }

  return queryClient;
};
