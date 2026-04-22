import { del, get, set } from 'idb-keyval';
import superjson from 'superjson';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

let queryClient: QueryClient | null = null;

function createQueryClient(): QueryClient {
  const client = new QueryClient({
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
    persistQueryClient({
      queryClient: client,
      persister: createAsyncStoragePersister({
        storage: {
          getItem: (key) => get(key),
          setItem: (key, value) => set(key, value),
          removeItem: (key) => del(key),
        },
        key: 'REACT_QUERY_OFFLINE_CACHE',
        throttleTime: 1000,
        serialize: superjson.stringify,
        deserialize: superjson.parse,
      }),
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  return client;
}

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}
