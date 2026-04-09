import path from 'node:path';
import url from 'node:url';
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export default defineConfig({
  site: 'https://fast-web-tech.co.uk',

  devToolbar: {
    enabled: false,
  },
  server: {
    allowedOrigins: ['*'], // ✅ dev only
  },
  output: 'server',
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
    plugins: [tailwindcss()],
  },
  integrations: [react({ include: ['**/reactcomp/**/*'] }), sitemap()],
  adapter: node({
    mode: 'standalone',
  }),
});
