import { createFileRoute, Link } from '@tanstack/react-router';

import { buildSeoHead } from '@app/lib/seo/build-seo-head';
import { getSeo } from '@app/lib/seo/get-seo.fn';

export const Route = createFileRoute('/')({
  loader: ({ location }) =>
    getSeo({
      data: {
        title: 'Playground | TanStack Start',
        description: 'A main page',
        type: 'website',
        pathname: location.pathname,
      },
    }),
  head: ({ loaderData }) => buildSeoHead(loaderData),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex gap-4">
        <Link className="rounded-lg border border-amber-200 p-3 text-2xl text-cyan-200" to="/login">
          Login
        </Link>
        <Link className="rounded-lg border border-amber-200 p-3 text-2xl text-amber-300" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
