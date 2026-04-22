import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';

// ← browserClient, not query

export default function DevTools() {
  const client = getQueryClient(); // ← no useState needed, it's already a singleton

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
