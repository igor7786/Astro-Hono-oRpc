import { Suspense } from 'react';

import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';

// src/components/reactcomp/playground/GeoDebugCard.tsx
import { ErrorBoundary } from 'react-error-boundary';

// Import Shadcn Card Components
import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

function GeoDebugContent() {
  const client = getQueryClient();
  const { data: geo } = useQuery(
    orpc.geo.geoContract.queryOptions({
      queryKey: orpc.geo.geoContract.key(),
      input: {},
      retry: false,
      suspense: true,
    }),
    client
  );

  return (
    <pre className="overflow-x-auto rounded-lg border border-white/5 bg-white/1 p-4 text-left font-mono text-xs leading-5 text-neutral-200 transition-all duration-200 hover:border-primary/50 hover:bg-white/3">
      <code>{JSON.stringify(geo, null, 2)}</code>
    </pre>
  );
}

function GeoDebugFallback() {
  return (
    <output className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/1 p-4">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-blue-500"
        aria-hidden="true"
      />
      <span className="font-mono text-xs text-neutral-500">Resolving location…</span>
    </output>
  );
}

function GeoDebugError({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/2 p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="font-mono text-xs text-red-400">Could not load geo data</span>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="font-mono text-xs text-red-400 underline underline-offset-2 hover:no-underline"
      >
        Retry
      </button>
    </div>
  );
}

export function GeoDebugCard() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel/90 py-0 shadow-2xl backdrop-blur-xl hover:border-white">
      {/* Header section matching your project's dashboard style */}
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          {/* Left Corner badge & title layout */}
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              Geo
            </span>
            Request Metadata
          </h2>

          {/* Right Corner tracking code element */}
          <span className="font-mono text-xs text-neutral-500">HTTP/3</span>
        </div>
      </CardHeader>

      {/* Main container wrapper containing suspense query elements */}
      <CardContent className="p-4">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} fallbackRender={GeoDebugError}>
              <Suspense fallback={<GeoDebugFallback />}>
                <GeoDebugContent />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </CardContent>
    </Card>
  );
}
