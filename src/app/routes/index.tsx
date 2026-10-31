import { createFileRoute } from '@tanstack/react-router';

import { buildSeoHead } from '@app/lib/seo/build-seo-head';
import { getSeo } from '@app/lib/seo/get-seo.fn';

import { LoginPage } from '@rcomp/auth/LoginPage';
export const Route = createFileRoute('/')({
  loader: ({ location }) =>
    getSeo({
      data: {
        title: 'Playground | TanStack Start',
        description: 'A playground for TanStack Start',
        type: 'website',
        pathname: location.pathname,
      },
    }),
  head: ({ loaderData }) => buildSeoHead(loaderData),
  component: Home,
});

function Home() {
  return <LoginPage />;
}
