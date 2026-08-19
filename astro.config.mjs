import { satteri } from '@astrojs/markdown-satteri';
import react from '@astrojs/react';
// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import bun from '@wyattjoh/astro-bun-adapter';
import iconset from 'astro-iconset';
import { defineConfig, fontProviders } from 'astro/config';

import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import cspManifestPlugin from './src/plugins/astro-csp-manifest.ts';
import serverStartup from './src/plugins/clients';

// import { boneyardPlugin } from 'boneyard-js/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  site: 'https://fast-web-tech.co.uk/',
  server: {
    host: 'localhost', // ← Bind the interfaces
    port: 4322, // ← Explicit port
    // allowedOrigins: ['https://fast-web-tech.co.uk', 'http://localhost:4321'],
    allowedHosts: [
      'fast-web-tech.co.uk',
      'www.fast-web-tech.co.uk',
      'host.docker.internal',
      'localhost',
    ], // ✅ dev only
  },
  trailingSlash: 'never',
  compressHTML: false,

  devToolbar: {
    enabled: false,
  },
  output: 'server',
  adapter: bun(),

  vite: {
    ssr: {
      resolve: { externalConditions: ['bun', 'node'] },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@db': path.resolve(__dirname, './db'),
        '@rcomp': path.resolve(__dirname, './src/components/reactcomp'),
        '@acomp': path.resolve(__dirname, './src/components/astrocomp'),
      },
    },
    plugins: [
      tailwindcss(),
      // bunx boneyard-js build http://localhost:4321/notifications
    ],
  },

  fonts: [
    // ✅ Inter Variable — body text
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      fallbacks: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      weights: ['100 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },

    // ✅ Playfair Display — headings (elegant, editorial)
    {
      provider: fontProviders.fontsource(),
      name: 'Playfair Display',
      cssVariable: '--font-heading',
      fallbacks: ['Georgia', 'ui-serif', 'serif'],
      weights: ['100 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },

    // // ✅ JetBrains Mono — code blocks
    {
      provider: fontProviders.fontsource(),

      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      weights: ['100 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
  ],
  markdown: {
    // readingTime: true, // ← built-in, no remark plugin needed
    syntaxHighlight: 'prism',

    processor: satteri({
      features: {
        directive: true,
      },
    }),
  },
  integrations: [
    react({ include: ['**/reactcomp/**/*.tsx', '**/reactcomp/**/*.jsx'] }),
    // Client startup integration [✅ Redis, Env, etc.]
    serverStartup(),
    cspManifestPlugin(),
    // boneyardPlugin({ /* plugin options */ }),
    // sitemap integration
    sitemap({
      // 1️⃣ Filter out pages that shouldn't be indexed
      filter(page) {
        // Exclude admin, auth, user-specific routes
        if (page.includes('/admin') || page.includes('/dashboard')) return false;
        if (page.includes('/og') || page.includes('/api')) return false;
        // Exclude dynamic routes with params you don't want indexed
        if (page.includes('/user/') || page.includes('/account/')) return false;
        return true;
      },

      // 2️⃣ Smart serialize with reliable lastmod
      serialize(item) {
        const entry = { url: item.url };

        // 📝 Blog/Content Collections → use frontmatter date
        if (item.route?.startsWith('/blog/') || item.route?.startsWith('/docs/')) {
          const slug = item.params?.slug;
          if (slug) {
            // Try blog collection first, then docs
            const post =
              getCollection('blog').find((p) => p.slug === slug) ||
              getCollection('docs').find((p) => p.slug === slug);

            if (post?.data?.updated) {
              entry.lastmod = post.data.updated;
            } else if (post?.data?.date) {
              entry.lastmod = post.data.date;
            }
          }
        }

        // 📄 Static .astro/.mdx pages → use file modification time
        else if (item.route && !item.route.includes('[')) {
          try {
            // Map URL to likely file path (adjust for your structure)
            const possiblePaths = [
              path.join(process.cwd(), 'src/pages', item.url.replace(/^\//, '') + '.astro'),
              path.join(process.cwd(), 'src/pages', item.url.replace(/^\//, '') + '.mdx'),
              path.join(process.cwd(), 'src/pages', item.url.replace(/^\//, ''), 'index.astro'),
            ];

            for (const filePath of possiblePaths) {
              if (fs.existsSync(filePath)) {
                entry.lastmod = fs.statSync(filePath).mtime;
                break;
              }
            }
          } catch {
            // Fallback: omit lastmod if we can't determine it
          }
        }

        // ⚡ Fully dynamic SSR pages (e.g., /product/[id]) → omit lastmod
        // Why? Content changes based on DB, not file edits → can't track reliably

        // 🎯 Optional: Set priority/changefreq for important pages
        if (item.url === '/') {
          entry.priority = 1.0;
          entry.changefreq = 'daily';
        } else if (item.route?.startsWith('/blog/')) {
          entry.priority = 0.8;
          entry.changefreq = 'monthly';
        }

        return entry;
      },
    }),
    iconset({
      iconDirs: {
        ui: 'src/assets/icons',
      },
      include: {
        // Only ship the icons your server routes actually render
        mdi: ['account', 'home', 'menu', 'close'],
        // To include a whole set (can be large):
        // ri: ["*"],
        logos: [
          'nginx',
          'hono',
          'postgresql',
          'sqlite',
          'react-query-icon',
          'tailwindcss-icon',
          'react',
          'zod',
          'bun',
        ],
        skillIcons: ['astro', 'vite-light'],
        selfhst: ['rustfs', 'arcane', 'authentik', 'crowdsec'],
        gravityUi: ['abbr-api'],
        simpleIcons: ['scalar', 'ionos'],
        lucide: ['logs'],
      },
    }),
  ],
});
