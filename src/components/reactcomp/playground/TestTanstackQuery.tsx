import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery'; // ← use the mainQuery client, not the old query
import { clientOrpc as orpc } from '@/server/web.client';
import { type TestInput } from '@/server/schemas/test.schema';
interface Props {
  className?: string;
  initialData?: { name: string } | null;
  name?: TestInput['name']; // ← add name prop to pass to the query
}

// TestTanstackQuery.tsx
export default function UserProfile({ className, initialData, name }: Props) {
  const client = getQueryClient();
  const { data, isLoading, error } = useQuery(
    orpc.test.queryOptions({
      input: { name }, // ← use the prop, not hardcoded
      queryKey: ['test', { name }],
      initialData: initialData ?? undefined,
    }),
    client
  );
  if (isLoading) return <div className={className}>Loading...</div>;
  if (error) return <div className={className}>Error: {error.message}</div>;
  return (
    <div className={className}>
      {data?.name} — fetched on {initialData ? 'Server (SSR)' : 'Client'}
    </div>
  );
}
