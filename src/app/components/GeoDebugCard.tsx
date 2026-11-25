import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ClientOnly } from '@tanstack/react-router';

import { BoneSuspense, Skeleton } from 'boneyard-js/react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

import { useHttpProtocol } from '@/app/lib/hooks/use-http-protocol';
import { clientOrpc } from '@/server/clients/client';

const geoFixture = {
  city: 'London',
  country: 'GB',
  region: 'ENG',
  ip: '203.0.113.42',
  colo: 'LHR',
};

function GeoDebugPre({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-white/5 bg-white/1 p-4 text-left font-mono text-xs leading-5 text-neutral-200 transition-all duration-200 hover:border-primary/50 hover:bg-white/3">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

function GeoDebugContent() {
  const { data: geo } = useSuspenseQuery(
    clientOrpc.geo.geoContract.queryOptions({
      queryKey: clientOrpc.geo.geoContract.key(),
      input: {},
      retry: false,
    })
  );

  return <GeoDebugPre data={geo} />;
}

function GeoDebugError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/2 p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="font-mono text-xs text-red-400">Could not load geo data</span>
      </div>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="font-mono text-xs text-red-400 underline underline-offset-2 hover:no-underline"
      >
        Retry
      </button>
    </div>
  );
}

export function GeoDebugCard() {
  const protocol = useHttpProtocol();

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel/90 py-0 shadow-2xl backdrop-blur-xl hover:border-white">
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Geo
            </span>
            Request Metadata
          </h2>

          <span className="font-mono text-xs text-neutral-500">{protocol ?? '...'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ClientOnly
          fallback={
            <Skeleton name="geo-card" loading={true}>
              {null}
            </Skeleton>
          }
        >
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} fallbackRender={GeoDebugError}>
                <BoneSuspense name="geo-card" fixture={<GeoDebugPre data={geoFixture} />}>
                  <GeoDebugContent />
                </BoneSuspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
