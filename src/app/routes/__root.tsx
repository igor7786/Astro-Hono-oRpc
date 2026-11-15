import { TanStackDevtools } from '@tanstack/react-devtools';

import '@app/lib/zod-config';
import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { RedirectToErrorPage } from '@app/components/RedirectToErrorPage';
import { ThemeProvider } from '@app/components/theme-provider';
import TanStackQueryDevtools from '@app/integrations/tanstack-query/devtools';

// import { envClient } from '@/lib/env/client.env';
import appCss from '@/styles/global.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
}

const NONCE_SHIM = `(()=>{const n=document.currentScript?.nonce||document.currentScript?.getAttribute('nonce');if(!n)return;const o=document.createElement.bind(document);Object.defineProperty(document,'createElement',{value:(t,p)=>{const e=o(t,p);if(typeof t==='string'&&t.toLowerCase()==='style')e.setAttribute('nonce',n);return e;}});})();`;

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
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isScalar = pathname.replace(/\/+$/, '') === '/scalar';

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {isScalar && nonce && <script nonce={nonce} dangerouslySetInnerHTML={{ __html: NONCE_SHIM }} />}
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Outlet />
        </ThemeProvider>

        {import.meta.env.DEV && (
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
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
