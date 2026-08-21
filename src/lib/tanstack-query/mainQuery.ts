// src/lib/stores/query.ts
import { QueryClient } from '@tanstack/react-query';
import { type Persister, persistQueryClient } from '@tanstack/react-query-persist-client';

// Only ever singleton on the client. The server must create a fresh
// QueryClient per request — this module is loaded once per process,
// not once per request, so a server-side singleton leaks data across users.
let browserQueryClient: QueryClient | null = null;
let browserPersister: Persister | null = null;

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
    // ← dynamic imports keep idb-keyval + superjson out of the SSR bundle
    Promise.all([
      import('idb-keyval'),
      import('superjson'),
      import('@tanstack/query-async-storage-persister'),
    ]).then(([{ get, set, del }, superjson, { createAsyncStoragePersister }]) => {
      const persister = createAsyncStoragePersister({
        storage: {
          getItem: (key) => get(key),
          setItem: (key, value) => set(key, value),
          removeItem: (key) => del(key),
        },
        key: 'REACT_QUERY_OFFLINE_CACHE',
        throttleTime: 1000,
        serialize: superjson.stringify,
        deserialize: superjson.parse,
      });

      // stash it so logout can clear the persisted cache
      browserPersister = persister;

      persistQueryClient({
        queryClient: client,
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      });
    });
  }

  return client;
}

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: never share across requests — always fresh
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

// Call this from your UNAUTHORIZED / auth-redirect interceptor before
// window.location.replace() — clears both in-memory and persisted cache
// so the next user (or re-login) doesn't briefly see stale authed data.
export async function clearQueryCache(): Promise<void> {
  if (browserQueryClient) {
    browserQueryClient.clear();
  }
  if (browserPersister) {
    await browserPersister.removeClient();
  }
}
