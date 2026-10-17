// src/lib/stores/query.ts
import { QueryClient } from '@tanstack/react-query';
import { type Persister, persistQueryClient } from '@tanstack/react-query-persist-client';

const CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24h, used for both persistence and gcTime

// Browser: one singleton.
// Server: a fresh QueryClient per request, so cached data never leaks between users
// (this module is loaded once per process, not once per request).
let browserQueryClient: QueryClient | null = null;
let browserPersister: Persister | null = null;
let persistenceReady: Promise<void> = Promise.resolve();

async function setupPersistence(client: QueryClient): Promise<void> {
  try {
    // Dynamic imports keep these browser-only packages out of the SSR bundle.
    const [{ get, set, del }, superjson, { createAsyncStoragePersister }] = await Promise.all([
      import('idb-keyval'),
      import('superjson'),
      import('@tanstack/query-async-storage-persister'),
    ]);

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

    // Keep a reference so logout can clear the persisted data.
    browserPersister = persister;

    const [, restorePromise] = persistQueryClient({
      queryClient: client,
      persister,
      maxAge: CACHE_MAX_AGE,
    });

    await restorePromise;
  } catch (error: unknown) {
    console.error('Failed to initialize React Query persistence:', error);
  }
}

function createQueryClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
        gcTime: CACHE_MAX_AGE, // must be >= persister maxAge
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        refetchOnMount: false,
      },
    },
  });

  if (typeof window !== 'undefined') {
    persistenceReady = setupPersistence(client);
  }

  return client;
}

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}

// Call before redirecting after logout or an unauthorized response.
// Clears the in-memory cache and the persisted cache.
export async function clearQueryCache(): Promise<void> {
  await persistenceReady; // make sure persistence finished setting up first

  browserQueryClient?.clear();
  await browserPersister?.removeClient();
}
