import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@rcomp/auth/LoginPage';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

export const Route = createFileRoute('/_auth/login')({
  loader: ({ location }) =>
    getSeo({
      data: {
        title: 'TanStack Start Auth-Login',
        description: 'A login page',
        type: 'website',
        pathname: location.pathname,
      },
    }),
  head: ({ loaderData }) => buildSeoHead(loaderData),
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage astro={false} />;
}
