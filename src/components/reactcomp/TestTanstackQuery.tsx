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
  const { data, isLoading } = useQuery(
    orpc.test.queryOptions({
      input: { name: 'from Tanstack Query Client' },
    }),
    client // ← nanostores singleton client
  );

  if (isLoading) return <div className={className}>Loading...</div>;
  return <div className={className}>{data?.name}</div>;
}
