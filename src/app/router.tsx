// src/app/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { getGlobalStartContext } from '@tanstack/react-start';

import { getContext } from '@app/integrations/tanstack-query/root-provider';
import { routeTree } from '@app/routeTree.gen';
export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    ssr: {
      // Automatically grabs the nonce injected by your custom request middleware
      nonce: getGlobalStartContext()?.nonce,
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
