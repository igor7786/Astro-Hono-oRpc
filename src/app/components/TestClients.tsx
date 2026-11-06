// src/components/reactcomp/playground/TestClients.tsx
import { useQuery } from '@tanstack/react-query';

import { useHttpProtocol } from '@app/lib/hooks/use-http-protocol';

import { cn } from '@rcomp/lib/utils';
import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

import { clientOrpc } from '@/server/clients/client';

const clientLabels = {
  pg: 'PostgreSQL',
  neon: 'Neon',
  sqlite: 'SQLite',
  redis: 'Redis',
  s3: 'S3',
  kafka: 'Kafka',
} as const;

type ClientKey = keyof typeof clientLabels;

export default function TestClients() {
  const protocol = useHttpProtocol();

  const { data, error } = useQuery({
    ...clientOrpc.tests.testClients.experimental_liveOptions({ retry: true }),
    // The live stream only runs in the browser, never during SSR
    enabled: typeof window !== 'undefined',
  });

  const isLoading = !data && !error;
  const allConnected = data ? Object.values(data).every((s) => s.connected) : undefined;

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel/90 py-0 shadow-2xl backdrop-blur-xl hover:border-white">
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="relative inline-flex">
              <span className="rounded border border-violet-500/20 bg-violet-500/10 px-3 py-0.5 text-xs font-medium text-violet-400">
                SSE
              </span>
              <span
                className={cn(
                  'absolute top-1.5 right-1 size-2 animate-pulse rounded-full',
                  isLoading && 'bg-neutral-500',
                  allConnected === true && 'bg-green-500',
                  (allConnected === false || !!error) && 'bg-red-500'
                )}
              />
            </span>
            Client Health
            <span className="text-sm font-normal text-muted-foreground">
              ({Object.keys(clientLabels).length})
            </span>
          </h2>

          <span className="font-mono text-xs text-neutral-500">{protocol ?? '...'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {error && (
          <p className="mb-2 font-mono text-xs text-red-400">Could not load status: {error.message}</p>
        )}

        <ul className="space-y-1.5">
          {(Object.entries(clientLabels) as [ClientKey, string][]).map(([key, label]) => {
            const status = data?.[key];
            const failed = status ? !status.connected : false;

            return (
              <li key={key}>
                <div
                  className={cn(
                    'grid grid-cols-12 items-center rounded-lg border bg-white/1 px-4 py-2 text-sm transition-all duration-200',
                    failed
                      ? 'border-red-500/30 bg-red-500/2'
                      : 'border-white/5 hover:border-violet-500/50 hover:bg-white/3'
                  )}
                >
                  {/* Left: orb + name. Always visible. */}
                  <div className="col-span-7 flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-full',
                        !status && 'bg-neutral-600',
                        status?.connected && 'bg-green-500/80',
                        failed && 'bg-red-500/80'
                      )}
                    />
                    <span
                      className={cn(
                        'truncate font-sans text-sm font-medium',
                        failed ? 'text-red-400' : 'text-neutral-200'
                      )}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Right: the only part that depends on data */}
                  <div className="col-span-5 flex items-center justify-end gap-3 text-right font-mono text-xs tracking-tight">
                    {status ? (
                      <>
                        {status.latencyMs !== undefined && (
                          <span className="text-[11px] text-neutral-500">{status.latencyMs}ms</span>
                        )}
                        <span
                          className={cn(
                            'text-[11px] font-semibold tracking-wide uppercase',
                            status.connected ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          {status.connected ? 'online' : 'failed'}
                        </span>
                      </>
                    ) : error ? (
                      <span className="text-[11px] tracking-wide text-neutral-500 uppercase">
                        unknown
                      </span>
                    ) : (
                      <span className="h-3 w-16 animate-pulse rounded bg-white/10" />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
