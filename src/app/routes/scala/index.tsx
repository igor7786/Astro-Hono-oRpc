import { createFileRoute } from '@tanstack/react-router';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

export const Route = createFileRoute('/scala/')({
  component: ReferencePage,
});

function ReferencePage() {
  return (
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
  );
}
