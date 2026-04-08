import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@server/web.client';
import { $testData } from '@/lib/stores/ssr';
import { Button } from '@rcomp/ui/button';

interface Props {
  initialData?: { name: string };
  name?: string;
}

export const Nano = ({ initialData, name = 'default' }: Props) => {
  const client = getQueryClient();

  // ✅ seed store once on mount
  useEffect(() => {
    if (initialData) $testData.set(initialData);
  }, []);

  // ✅ store value — used as initialData for React Query
  const storeData = useStore($testData);

  // ✅ React Query takes over — background refetch, cache, IndexedDB
  const { data, isLoading, error } = useQuery(
    orpc.test.queryOptions({
      input: { name },
      queryKey: ['test', { name }],
      initialData: storeData ?? initialData, // ← store or prop
      initialDataUpdatedAt: 0, // ← always refetch in background
    }),
    client
  );

  const onClick = () => {
    // ✅ update store on button click
    $testData.set({ name: 'Updated Name From main component' });
  };

  if (isLoading) return <header>Loading...</header>;
  if (error) return <header>Error: {error.message}</header>;
  // ✅ storeData updates instantly when AnyOtherComponent clicks
  return <Button onClick={onClick}>{storeData?.name ?? data?.name}</Button>;
};
