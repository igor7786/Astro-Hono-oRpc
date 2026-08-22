import { useQuery } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

export default function TestRedirect() {
  const client = getQueryClient();
  const { data, isLoading, error } = useQuery(
    orpc.tests.redirectTest.queryOptions({
      input: { name: 'admin' },
      retry: false,
    }),
    client
  );
  if (isLoading) {
    // If the query is still loading, show a loading message
    return <div>Verifying account credentials...</div>;
  }

  // If a completely different error occurs, handle it here
  if (error && error.name !== 'REDIRECT_TO_HOME') {
    return <div>An unrelated error occurred: {error.message}</div>;
  }

  return <div>{data?.name}</div>;
}
