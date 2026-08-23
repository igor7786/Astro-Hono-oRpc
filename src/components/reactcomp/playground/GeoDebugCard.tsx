import { Suspense } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { clientOrpc as orpc } from '@/server/clients/web.client';

function GeoDebugContent() {
  const client = getQueryClient();

  const { data: geo } = useQuery(
    orpc.geo.geoContract.queryOptions({
      queryKey: ['geo'],
      input: {},
      retry: false,
      suspense: true,
    }),
    client
  );

  return (
    <pre className="border-border hover:border-primary hover:text-primary bg-muted/30  overflow-x-auto rounded-lg border p-4 text-left font-sans text-sm leading-5">
      <code>{JSON.stringify(geo, null, 2)}</code>
    </pre>
  );
}

function GeoDebugFallback() {
  return <p className="text-muted-foreground text-left text-xs">Loading…</p>;
}

export function GeoDebugCard() {
  return (
    <div className="text-left">
      <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
          Geo
        </span>
        Request Metadata
      </h2>

      <Suspense fallback={<GeoDebugFallback />}>
        <GeoDebugContent />
      </Suspense>
    </div>
  );
}
