import { Link, createFileRoute } from '@tanstack/react-router';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import { Home } from 'lucide-react';
import '@scalar/api-reference-react/style.css';

import { Button } from '@rcomp/ui/button';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';

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

export function ReferencePage() {
  const url = '/api/rpc/openapi/v1/generate-schema';
  return (
    <>
      <ApiReferenceReact
        configuration={{
          theme: 'fastify',
          withDefaultFonts: false,
          sources: [
            {
              title: 'App API V1',
              slug: 'v1',
              url,
              // default: true,
            },
            {
              title: 'API v2',
              slug: 'v2',
              url: '/api/rpc/openapi/v2/generate-schema',
            },
          ],
        }}
      />

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
