import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@rcomp/ui/button';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/web.client';

export default function SlowRequest() {
  const client = getQueryClient();
  const [fetchId, setFetchId] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  const { data, isFetching, error } = useQuery(
    orpc.testSlow.queryOptions({
      input: { name: 'slow operation' },
      queryKey: ['slow-test', fetchId], // ← changes on every fetch
      enabled: fetchId > 0, // don't fetch on mount
      retry: false,
    }),
    client
  );

  const handleFetch = () => {
    setCancelled(false);
    // cancel previous query before starting new one
    client.cancelQueries({ queryKey: ['slow-test'] });
    setFetchId((id) => id + 1); // ← new key = new request, previous auto-cancelled
  };
  const handleMouseEnter = () => {
    client.prefetchQuery(
      orpc.testSlow.queryOptions({
        input: { name: 'slow operation' },
        queryKey: ['slow-test', fetchId],
      })
    );
  };

  const handleCancel = () => {
    setCancelled(true);
    client.cancelQueries({ queryKey: ['slow-test'] });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Slow Request (3s)</h2>

      <div className="flex gap-2">
        <Button
          onClick={handleFetch}
          onMouseEnter={handleMouseEnter}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isFetching ? 'Loading...' : 'Fetch'}
        </Button>

        <Button
          onClick={handleCancel}
          disabled={!isFetching}
          className="rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>

      <div className="text-sm">
        {isFetching && <p className="text-yellow-600">⏳ Waiting 10 seconds...</p>}
        {cancelled && !isFetching && <p className="text-red-600">🛑 Request cancelled</p>}
        {data && !cancelled && !isFetching && <p className="text-green-600">✅ {data.name}</p>}
        {error && <p className="text-red-600">❌ {error.message}</p>}
      </div>
    </div>
  );
}
