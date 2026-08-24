import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@rcomp/ui/button';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

export default function SlowRequest() {
  const client = getQueryClient();

  const [started, setStarted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const queryOptions = orpc.tests.slowTest.queryOptions({
    input: {
      name: 'slow operation',
    },
    queryKey: ['slow-test'],
    retry: false,
    enabled: started,
  });

  const { data, isFetching, error } = useQuery(queryOptions, client);

  // Start the request when the mouse enters the button.
  const handleMouseEnter = () => {
    setCancelled(false);
    setStarted(true);
  };

  // Start/restart the request when clicking Fetch.
  const handleFetch = () => {
    setCancelled(false);
    setStarted(true);

    // If there is already a cached result, force a new request.
    client.invalidateQueries({
      queryKey: ['slow-test'],
    });
  };

  const handleCancel = () => {
    setCancelled(true);

    client.cancelQueries({
      queryKey: ['slow-test'],
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Slow Request (6s)</h2>

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
        {isFetching && <p className="text-yellow-600">⏳ Waiting 6 seconds...</p>}

        {cancelled && !isFetching && <p className="text-red-600">🛑 Request cancelled</p>}

        {data && !cancelled && !isFetching && <p className="text-green-600">✅ {data.name}</p>}

        {error && !cancelled && <p className="text-red-600">❌ {error.message}</p>}
      </div>
    </div>
  );
}
