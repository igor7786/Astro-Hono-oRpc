import { useQueryClient } from '@tanstack/react-query';
// src/app/routes/playground.tsx
import { ClientOnly, createFileRoute } from '@tanstack/react-router';

import { RouteListCard } from '@app/components/RouteListCard';
import TestClients from '@app/components/TestClients';
import { getPlaygroundRoutes } from '@app/lib/playground-routes.fn';

import { GeoDebugCard } from '@rcomp/playground/GeoDebugCard';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

function TestClientsCard() {
  const queryClient = useQueryClient();
  return <TestClients client={queryClient} />;
}

export const Route = createFileRoute('/playground')({
  loader: async ({ location }) => {
    const [seo, routes] = await Promise.all([
      getSeo({
        data: {
          title: 'Playground | Home',
          description: 'Powered by TanStack Start + Hono + oRPC',
          type: 'website',
          pathname: location.pathname,
        },
      }),
      getPlaygroundRoutes(),
    ]);
    return { seo, routes };
  },
  head: ({ loaderData }) => buildSeoHead(loaderData?.seo),
  component: Playground,
});

function Playground() {
  const { routes } = Route.useLoaderData();

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

        {/* Same as client:only="react" in Astro */}
        <ClientOnly fallback={<div className="h-76 rounded-xl border border-white/10 bg-panel/50" />}>
          <TestClientsCard />
        </ClientOnly>
        <ClientOnly fallback={null}>
          <GeoDebugCard />
        </ClientOnly>
      </div>
    </div>
  );
}
