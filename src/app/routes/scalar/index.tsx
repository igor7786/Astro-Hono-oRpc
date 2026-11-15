import { Link, createFileRoute } from '@tanstack/react-router';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import { Home } from 'lucide-react';
import '@scalar/api-reference-react/style.css';

export const Route = createFileRoute('/scalar/')({
  component: ReferencePage,
});

function ReferencePage() {
  return (
    <>
      <ApiReferenceReact
        configuration={{
          theme: 'fastify',
          sources: [
            {
              title: 'App API',
              slug: 'v1',
              url: '/api/rpc/openapi/v1/generate-schema',
              default: true,
            },
            // {
            //   title: 'API v2',
            //   slug: 'v2',
            //   url: '/api/rpc/openapi/v2/generate-schema',
            // },
          ],
        }}
      />

      <Link
        to="/"
        className="fixed bottom-16 left-4 z-50 inline-flex items-center gap-2 rounded-full border-2 border-transparent bg-neutral-900 py-2.5 pr-4 pl-3.5 text-[13px] font-semibold text-white no-underline shadow-md transition-colors hover:border-neutral-600 hover:bg-neutral-800"
      >
        <Home className="size-4.5" aria-hidden="true" />
        Home
      </Link>
    </>
  );
}
