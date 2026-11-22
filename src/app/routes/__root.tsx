import { TanStackDevtools } from '@tanstack/react-devtools';

import '@/bones/registry'; // path to your generated registry

import '@app/lib/zod-config';
import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
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

// Dev: force Vite to return real CSS for this <link>, so it can't collide
// with the module-script request to the same path from the Astro pages.
const cssHref = import.meta.env.DEV ? `${appCss}${appCss.includes('?') ? '&' : '?'}direct` : appCss;

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
      { rel: 'stylesheet', href: cssHref },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'sitemap', href: '/sitemap-index.xml' },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument() {
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {nonce && <script nonce={nonce} dangerouslySetInnerHTML={{ __html: NONCE_SHIM }} />}
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
