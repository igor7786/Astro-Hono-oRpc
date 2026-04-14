import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { boneyardPlugin } from 'boneyard-js/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  ssr: {
    resolve: { externalConditions: ['bun', 'node'] },
    //  external: ['boneyard-js']
  },
  site: 'http://localhost:4321/',
  server: {
    host: 'localhost', // ← Bind the interfaces
    port: 4321, // ← Explicit port
    allowedOrigins: ['https://fast-web-tech.co.uk', 'http://localhost:4321'],
    allowedHosts: [
      'fast-web-tech.co.uk',
      'www.fast-web-tech.co.uk',
      'host.docker.internal',
      'localhost',
    ], // ✅ dev only
  },
  trailingSlash: 'ignore',
  compressHTML: false,

  devToolbar: {
    enabled: false,
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@db': path.resolve(__dirname, './db'),
        '@rcomp': path.resolve(__dirname, './src/components/reactcomp'),
        '@acomp': path.resolve(__dirname, './src/components/astrocomp'),
        '@server': path.resolve(__dirname, './src/lib/server'),
      },
    },
    plugins: [
      tailwindcss(),
      // bunx boneyard-js build http://localhost:4321/notifications
      boneyardPlugin({
        out: './src/bones',
        breakpoints: [375, 768, 1280],
        wait: 3000,
        skipInitial: false,
        watch: true,
      }),
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
    shikiConfig: {
      theme: 'dracula',
    },
  },

  integrations: [
    react({ include: ['**/reactcomp/**/*'] }),
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
  ],
});
