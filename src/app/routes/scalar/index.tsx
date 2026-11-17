import { Link, createFileRoute } from '@tanstack/react-router';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import { Home } from 'lucide-react';
import '@scalar/api-reference-react/style.css';

import { Button } from '@rcomp/ui/button';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

const scalarConfig = {
  theme: 'fastify' as const,
  withDefaultFonts: false,
  urlRouting: false, // Scalar no longer reads or writes the URL hash
  sources: [
    { title: 'App API V1', slug: 'v1', url: '/api/rpc/openapi/v1/generate-schema' },
    { title: 'API v2', slug: 'v2', url: '/api/rpc/openapi/v2/generate-schema' },
  ],
};

export const Route = createFileRoute('/scalar/')({
  loader: ({ location }) =>
    getSeo({
      data: {
        title: 'Scalar',
        description: 'API Documentation',
        type: 'website',
        pathname: location.pathname,
      },
    }),
  head: ({ loaderData }) => buildSeoHead(loaderData),
  component: ReferencePage,
});

function ReferencePage() {
  return (
    <>
      <ApiReferenceReact configuration={scalarConfig} />

      <Button
        variant="secondary"
        nativeButton={false}
        render={<Link to="/" />}
        className="fixed bottom-16 left-4 z-50 rounded-full border-2 border-transparent shadow-md hover:border-neutral-600"
      >
        <Home className="size-4.5" aria-hidden="true" />
        Home
      </Button>
    </>
  );
}
