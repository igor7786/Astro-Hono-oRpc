import { getQueryClient } from '@/lib/tanstack-query/query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function TanstackDevWrapper({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} client={client} />
    </>
  );
}
