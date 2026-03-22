import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { $queryClient } from '@/lib/tanstack-query/query';
import { clientOrpc as orpc } from '@server/web.client';
interface TestClientProps {
  className?: string;
  // Add other props as needed
}
export default function UserProfile({ className }: TestClientProps) {
  const client = useStore($queryClient);

  const { data, isLoading } = useQuery(
    orpc.test.queryOptions({
      input: {
        // ← you're missing this wrapper!
        name: 'Tanstack Query with Nanostores',
      },
    }),
    client // ← nanostores singleton client
  );

  if (isLoading) return <div className={className}>Loading...</div>;
  return <div className={className}>{data?.name}</div>;
}
