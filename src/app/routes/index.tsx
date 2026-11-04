import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Hydrate } from '@tanstack/react-start';
import { idle } from '@tanstack/react-start/hydration';

import { Header } from '@app/components/Header';
import { RouteListCard } from '@app/components/RouteListCard';
import TechIcons from '@app/components/TechIcons';
import TestClients from '@app/components/TestClients';
import { technologies } from '@app/lib/icons/static-icons-map';
import { getPlaygroundRoutes } from '@app/lib/route-sources';

import { GeoDebugCard } from '@/app/components/GeoDebugCard';
import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

export const Route = createFileRoute('/')({
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

  // Build admin route items from the shared technologies array.
  const adminRoutes = technologies
    .filter(
      (
        technology
      ): technology is typeof technology & {
        route: string;
        label: string;
      } => Boolean(technology.route && technology.label)
    )
    .map(({ route, label, size }) => ({
      route,
      label,
      size,
    }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <TechIcons />

        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-6 text-center">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <RouteListCard
              accent="ssr"
              badgeLabel="SSR + CSR"
              title="Server and Client pages"
              items={routes.ssrRoutes}
            />

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
              items={adminRoutes}
              masked
            />

            <ClientOnly>
              <TestClients />
            </ClientOnly>

            <Hydrate when={idle()} split={false}>
              <GeoDebugCard />
            </Hydrate>
          </div>
        </div>
      </main>
    </div>
  );
}
