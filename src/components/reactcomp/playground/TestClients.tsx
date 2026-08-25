import { useQuery } from '@tanstack/react-query';

import { cn } from '@rcomp/lib/utils';
// Import Shadcn Card Components
import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

const clientLabels = {
  pg: 'PostgreSQL',
  neon: 'Neon',
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

  if (isLoading) return <div className="text-neutral-500 font-mono text-xs">Loading...</div>;
  if (error) return <div className="text-red-400 font-mono text-xs">Error: {error.message}</div>;
  if (!data) return <div className="text-neutral-500 font-mono text-xs">Waiting for data...</div>;

  const allConnected = Object.values(data).every((s) => s.connected);

  return (
    <Card className="bg-panel/90 flex flex-col overflow-hidden rounded-xl border border-border py-0 shadow-2xl backdrop-blur-xl">
      {/* Header section matching error and geo card layout patterns */}
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          {/* Left Corner badge & title layout */}
          <h2 className="text-white flex items-center gap-2 font-semibold text-sm">
            <div className="relative">
              <span className="rounded border border-violet-500/20 bg-violet-500/10 px-3 py-0.5 text-xs font-medium text-violet-400">
                SSE
              </span>
              <span
                className={cn(
                  'absolute top-1.5 right-1 size-2 animate-pulse rounded-full',
                  allConnected ? 'bg-green-500' : 'bg-red-500'
                )}
              />
            </div>
            Client Health
            <span className="text-muted-foreground text-sm font-normal">
              ({Object.keys(clientLabels).length})
            </span>
          </h2>

          {/* Right Corner tracking code element */}
          <span className=" font-mono text-xs text-neutral-500">HTTP/3</span>
        </div>
      </CardHeader>

      {/* Main Container Wrapper containing status metrics split across columns */}
      <CardContent className="p-4">
        <ul className="space-y-1.5">
          {(Object.entries(clientLabels) as [keyof typeof clientLabels, string][]).map(
            ([key, label]) => {
              const status = data[key];
              return (
                <li key={key}>
                  <div
                    className={cn(
                      'grid grid-cols-12 items-center rounded-lg border px-4 py-2 text-sm transition-all duration-200 bg-white/1',
                      status.connected
                        ? 'border-white/5 hover:border-violet-500/50 hover:bg-white/3'
                        : 'border-red-500/30 bg-red-500/2'
                    )}
                  >
                    {/* Left Side: Client Name + Connection Orb (7 out of 12 columns) */}
                    <div className="col-span-7 flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full shrink-0',
                          status.connected ? 'bg-green-500/80' : 'bg-red-500/80'
                        )}
                      />
                      <span
                        className={cn(
                          'font-sans text-sm truncate font-medium',
                          status.connected ? 'text-neutral-200' : 'text-red-400'
                        )}
                      >
                        {label}
                      </span>
                    </div>

                    {/* Right Side: Latency metrics and Status Text (5 out of 12 columns) */}
                    <div className="col-span-5 flex items-center justify-end gap-3 text-right font-mono text-xs tracking-tight">
                      {status.latencyMs !== undefined && (
                        <span className="text-neutral-500 text-[11px]">{status.latencyMs}ms</span>
                      )}
                      <span
                        className={cn(
                          'text-[11px] font-semibold tracking-wide uppercase',
                          status.connected ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {status.connected ? 'online' : 'failed'}
                      </span>
                    </div>
                  </div>
                </li>
              );
            }
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
