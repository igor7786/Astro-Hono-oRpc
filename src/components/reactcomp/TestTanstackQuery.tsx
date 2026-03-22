import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/query';
import { clientOrpc as orpc } from '@server/web.client';
interface TestClientProps {
  className?: string;
  // Add other props as needed
}
export default function UserProfile({ className }: TestClientProps) {
  const client = getQueryClient();
  const { data, isLoading, error , isFetching} = useQuery(
    orpc.test.queryOptions({
      input: { name: 'from Tanstack Query Client' },
    }),
    client // ← nanostores singleton client
  );

  if (isLoading) return <div className={className}>Loading...</div>;
  if (isFetching) return <div className={className}>Updating...</div>;
  if (error) return <div className={className}>Error: {error.message}</div>;
  return <div className={className}>{data?.name}</div>;
}
