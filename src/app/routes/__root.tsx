// import { TanStackDevtools } from '@tanstack/react-devtools';
import '@app/lib/zod-config';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { RedirectToErrorPage } from '@app/components/RedirectToErrorPage';
import { ThemeProvider } from '@app/components/theme-provider';
// import TanStackQueryDevtools from '@app/integrations/tanstack-query/devtools';

// import { envClient } from '@/lib/env/client.env';
import appCss from '@/styles/global.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => <RedirectToErrorPage code={404} />,
  head: () => ({
    meta: [
      // Seo
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#0f172a' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@IGrimuta' },
      { name: 'twitter:creator', content: '@IGrimuta' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'sitemap', href: '/sitemap-index.xml' },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Outlet />
        </ThemeProvider>

        {/* {!envClient.PRODUCTION && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          /> */}
        {/* )} */}
        <Scripts />
      </body>
    </html>
  );
}
