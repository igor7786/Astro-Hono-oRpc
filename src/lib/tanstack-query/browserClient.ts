import { makeQueryClient } from '@/lib/tanstack-query/mainQuery';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { get, set, del } from 'idb-keyval';
import superjson from 'superjson';

const queryClient = makeQueryClient();

if (typeof window !== 'undefined') {
  persistQueryClient({
    queryClient,
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

export const getQueryClient = () => queryClient;
