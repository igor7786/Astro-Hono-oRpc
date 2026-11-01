import { adminRoutes } from '@/lib/helpers/icons';
import { discoverRoutes } from '@/lib/helpers/paths';

// src/pages/playground/routes.json.ts
import type { APIRoute } from 'astro';

export const prerender = true;

// Exclude this file itself, then normalise keys to './x.astro' so
// STATIC_FLAT / IGNORED_EXACT in paths.ts match as they do today
const raw = import.meta.glob(
  ['/src/pages/**/*.{astro,ts,tsx,js,jsx}', '!/src/pages/playground/routes.json.ts'],
  { eager: true }
);
const allFiles = Object.fromEntries(
  Object.entries(raw).map(([key, mod]) => [key.replace('/src/pages/', './'), mod])
);

// Lazy on purpose: only the file paths are used
const tanstackFiles = import.meta.glob('/src/app/routes/**/*.{ts,tsx}');

export const GET: APIRoute = async () => {
  const { ssrRoutes, staticRoutes } = await discoverRoutes(allFiles, tanstackFiles);
  return Response.json({ ssrRoutes, staticRoutes, adminRoutes });
};
