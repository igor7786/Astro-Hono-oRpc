// src/components/reactcomp/playground/GeoDebugCard.tsx
import { ErrorBoundary } from 'react-error-boundary';

import { Suspense } from 'react';

import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';

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
    <pre className="border-border bg-muted/30 overflow-x-auto rounded-lg border p-4 text-left font-mono text-sm leading-5">
      <code>{JSON.stringify(geo, null, 2)}</code>
    </pre>
  );
}

function GeoDebugFallback() {
  return (
    <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-4">
      <span
        className="border-muted-foreground/30 border-t-blue-500 h-4 w-4 animate-spin rounded-full border-2"
        role="status"
        aria-label="Loading geo data"
      />
      <span className="text-muted-foreground font-mono text-xs">Resolving location…</span>
    </div>
  );
}

function GeoDebugError({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className="border-error-server-dim bg-error-server/5 flex items-center justify-between gap-3 rounded-lg border p-4">
      <span className="text-error-server font-mono text-xs">Could not load geo data</span>
      <button
        onClick={resetErrorBoundary}
        className="text-error-server font-mono text-xs underline underline-offset-2 hover:no-underline"
      >
        Retry
      </button>
    </div>
  );
}

export function GeoDebugCard() {
  return (
    <div className="text-left">
      <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
          Geo
        </span>
        Request Metadata
      </h2>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} fallbackRender={GeoDebugError}>
            <Suspense fallback={<GeoDebugFallback />}>
              <GeoDebugContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
