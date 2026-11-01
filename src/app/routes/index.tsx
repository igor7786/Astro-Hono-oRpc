import { createFileRoute, Link } from '@tanstack/react-router';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

import { ModeToggle } from '../components/mode-toggle';

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
      <div className="flex items-center gap-4">
        <ModeToggle className="size-14 rounded-lg border-amber-200 bg-transparent text-2xl text-amber-300 hover:bg-amber-300/10" />
        <Link
          className="inline-flex h-14 items-center rounded-lg border border-amber-200 px-5 text-2xl text-cyan-200"
          to="/login"
        >
          Login
        </Link>
        <Link
          className="inline-flex h-14 items-center rounded-lg border border-amber-200 px-5 text-2xl text-amber-300"
          to="/register"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
