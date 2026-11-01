// src/app/routes/playground.tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { ClientOnly, createFileRoute } from '@tanstack/react-router';

import { RouteListCard } from '@app/components/RouteListCard';
import TestClients from '@app/components/TestClients';
import { playgroundRoutesQuery } from '@app/lib/playground-routes.query';

import { GeoDebugCard } from '@rcomp/playground/GeoDebugCard';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

export const Route = createFileRoute('/playground')({
  loader: async ({ context, location }) => {
    // Starts the query on the server (and on client navigation) and fills the cache.
    // ensureQueryData waits for it, so the page renders with data already in place.
    const [seo] = await Promise.all([
      getSeo({
        data: {
          title: 'Playground | Home',
          description: 'Powered by TanStack Start + Hono + oRPC',
          type: 'website',
          pathname: location.pathname,
        },
      }),
      context.queryClient.query(playgroundRoutesQuery),
    ]);
    return { seo }; // the routes live in the query cache, not in loaderData
  },
  head: ({ loaderData }) => buildSeoHead(loaderData?.seo),
  component: Playground,
});

function Playground() {
  // Data is already in the cache from the loader, so this doesn't suspend or flash
  const { data: routes } = useSuspenseQuery(playgroundRoutesQuery);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-6 text-center">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <RouteListCard accent="ssr" badgeLabel="SSR" title="Server Pages" items={routes.ssrRoutes} />
        <RouteListCard
          accent="static"
          badgeLabel="Static"
          title="Static Pages"
          items={routes.staticRoutes}
        />
        <RouteListCard
          accent="admin"
          badgeLabel="Admin"
          title="Admin Pages"
          items={routes.adminRoutes}
          masked
        />

        <ClientOnly fallback={<div className="h-76 rounded-xl border border-white/10 bg-panel/50" />}>
          <TestClients />
        </ClientOnly>
        <ClientOnly fallback={null}>
          <GeoDebugCard />
        </ClientOnly>
      </div>
    </div>
  );
}
