import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@rcomp/ui/button';
import { $testData } from '@/lib/stores/ssr';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/web.client';

export const useTest = (name: string, initialData?: { name: string }) => {
  const client = getQueryClient();

  // ✅ check cache first — skip fetch if already cached
  const cachedData = client.getQueryData<{ name: string }>(['test', { name }]);
  console.log('Cached data:', cachedData);

  return useQuery(
    orpc.test.queryOptions({
      input: { name },
      queryKey: ['test', { name }],
      initialData: cachedData ?? initialData, // cache → SSR prop
      initialDataUpdatedAt: 0,
      placeholderData: (prev) => prev, // show previous while fetching
      staleTime: 5000,
      enabled: !cachedData, // skip if cached
      retry: false,
    }),
    client
  );
};

interface Props {
  initialData?: { name: string };
  name?: string;
}

export const Nano = ({ initialData, name = 'default' }: Props) => {
  const client = getQueryClient();
  const [queryName, setQueryName] = useState(name);

  // ✅ seed store once on mount
  useEffect(() => {
    if (initialData) $testData.set(initialData);
  }, []);

  const storeData = useStore($testData);

  // ✅ use custom hook
  const { data, isFetching, isLoading, error } = useTest(queryName, storeData ?? initialData);

  // ✅ sync fresh data → store after every fetch
  useEffect(() => {
    if (data && !isFetching) {
      $testData.set(data);
    }
  }, [data, isFetching]);

  // ✅ toast on error
  useEffect(() => {
    if (error) console.error(error.message);
  }, [error]);

  const onClick = () => {
    setQueryName('new name'); // ← new query fires automatically
  };

  const onReset = () => {
    setQueryName(name); // ← back to original
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="text-sm text-gray-500">Query: {queryName}</p>
      <p className="text-sm text-gray-500">Source: {isFetching ? 'fetching...' : 'cached'}</p>
      <p className="font-bold">{storeData?.name ?? data?.name}</p>
      <div className="flex gap-2">
        <Button onClick={onClick} disabled={isFetching}>
          {isFetching ? 'Loading...' : 'Fetch new name'}
        </Button>
        <Button onClick={onReset} disabled={isFetching}>
          Reset
        </Button>
        <Button
          onClick={() => {
            // ✅ manually invalidate — forces refetch even if cached
            client.invalidateQueries({ queryKey: ['test', { name: queryName }] });
          }}
        >
          Force Refetch
        </Button>
      </div>
    </div>
  );
};
