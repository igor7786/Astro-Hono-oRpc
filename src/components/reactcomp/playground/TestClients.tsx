import { useQuery } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

const clientLabels = {
  pg: 'PostgreSQL',
  sqlite: 'SQLite',
  redis: 'Redis',
  s3: 'S3',
  kafka: 'Kafka',
} as const;

export default function TestClients() {
  const client = getQueryClient();
  const { data, error, isLoading } = useQuery(
    orpc.tests.testClients.experimental_liveOptions({
      retry: true,
    }),
    client
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-destructive text-sm">Error: {error.message}</div>;
  if (!data) return <div className="text-muted-foreground text-sm">Waiting for data...</div>;

  const allConnected = Object.values(data).every((s) => s.connected);

  return (
    <div>
      <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
        <div className="relative">
          <span className="bg-violet-300/10 text-violet-600 rounded px-3 py-0.5 text-xs">SSE</span>
          <span
            className={`absolute top-1.5 right-0.75 size-2 animate-caret-blink rounded-full ${
              allConnected ? 'bg-green-600 dark:bg-green-400' : 'bg-destructive'
            }`}
          />
        </div>
        Client Health
        <span className="text-muted-foreground text-sm font-normal">
          ({Object.keys(clientLabels).length})
        </span>
      </h2>
      <ul className="space-y-2">
        {(Object.entries(clientLabels) as [keyof typeof clientLabels, string][]).map(([key, label]) => {
          const status = data[key];
          return (
            <li key={key}>
              <div
                className={`border-border flex items-center gap-2 rounded-lg border px-3 py-3 text-sm transition-colors ${
                  status.connected ? 'hover:border-primary' : 'border-destructive/40'
                }`}
              >
                <span className="text-violet-400 font-sans text-sm">{label}</span>
                {status.latencyMs !== undefined && (
                  <span className="text-muted-foreground ml-auto text-xs">{status.latencyMs}ms</span>
                )}
                <span
                  className={`text-xs ${status.connected ? 'text-green-600' : 'text-destructive'} ${
                    status.latencyMs === undefined ? 'ml-auto' : ''
                  }`}
                >
                  {status.connected ? 'connected' : 'failed'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
