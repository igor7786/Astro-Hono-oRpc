import { client } from '@/server/web.client';
import { ORPCError } from '@orpc/client';
import { useState, useEffect } from 'react';
interface TestClientProps {
  className?: string;
  // Add other props as needed
}
export function TestClient({ className }: TestClientProps) {
  const [data, setData] = useState<{ name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .test({ name: 'from oRPC Client' })
      .then(setData)
      .catch((err) => {
        if (err instanceof ORPCError) {
          setError(`${err.message}`);
        } else {
          setError('Unexpected error');
        }
      });
  }, []);

  if (error) return <div className={className}> {error}</div>;
  if (!data) return <div className={className}>Loading...</div>;

  return <div className={className}>{data.name}</div>;
}
