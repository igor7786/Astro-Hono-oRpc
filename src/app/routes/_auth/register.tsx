import { createFileRoute } from '@tanstack/react-router';

import { RegisterPage } from '@rcomp/auth/RegisterPage';

import { buildSeoHead } from '@/app/lib/seo/build-seo-head';
import { getSeo } from '@/app/lib/seo/get-seo.fn';
export const Route = createFileRoute('/_auth/register')({
  loader: ({ location }) =>
    getSeo({
      data: {
        title: 'TanStack Start Auth-Register',
        description: 'A register page',
        type: 'website',
        pathname: location.pathname,
      },
    }),
  head: ({ loaderData }) => buildSeoHead(loaderData),
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage astro={false} />;
}
