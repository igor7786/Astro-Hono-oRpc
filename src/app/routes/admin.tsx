// src/app/routes/playground.tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { ClientOnly, createFileRoute } from '@tanstack/react-router';

import { Header } from '@app/components/Header';
import { RouteListCard } from '@app/components/RouteListCard';
import TechIcons from '@app/components/TechIcons';
import TestClients from '@app/components/TestClients';
import { playgroundRoutesQuery } from '@app/lib/playground-routes.query';

import { GeoDebugCard } from '@rcomp/playground/GeoDebugCard';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

export const Route = createFileRoute('/admin')({
  loader: async ({ context, location }) => {
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
    return { seo };
  },
  head: ({ loaderData }) => buildSeoHead(loaderData?.seo),
  component: Playground,
});

function Playground() {
  const { data: routes } = useSuspenseQuery(playgroundRoutesQuery);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 🛠️ Per-Route Layout Header */}
      <Header />
      {/* 📋 Core Page Viewport Body */}
      <main className="flex-1">
        <TechIcons />
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

            <ClientOnly
              fallback={<div className="h-76 rounded-xl border border-white/10 bg-panel/50" />}
            >
              <TestClients />
            </ClientOnly>
            <ClientOnly fallback={null}>
              <GeoDebugCard />
            </ClientOnly>
          </div>
        </div>
      </main>
    </div>
  );
}
