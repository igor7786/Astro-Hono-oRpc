import { join } from 'node:path';

import { allRouters } from '@/server/routers/all.routers';

// Files/folders to ignore globally when scanning routes
export const IGNORED_FILES = ['og', '_', 'api', 'robots'];

// Specific files to ignore exactly (full path match)
export const IGNORED_EXACT = ['./index.astro', './404.astro', './500.astro'];

// Pages that should always be treated as static (even if not dynamic)
export const STATIC_FLAT = ['./index.astro'];

// Must match tanstackStart({ router: { basepath } }) in astro.config.
// Use '' when there is no basepath, or '/app' if you still have basepath: 'app'.
export const TANSTACK_BASEPATH = '/app';

/**
 * Determines whether a file path should be ignored.
 *
 * Rules:
 * - Ignore exact matches (e.g. index page)
 * - Ignore any file inside special folders (e.g. /api/, /og/)
 * - Ignore files that start with reserved names (e.g. /robots.ts)
 */
export function isIgnored(path: string) {
  if (IGNORED_EXACT.includes(path)) return true;

  return IGNORED_FILES.some(
    (ignored) =>
      path.includes(`/${ignored}/`) || // inside a folder (e.g. /api/foo)
      path.includes(`/${ignored}.`) || // file like /robots.ts
      path.endsWith(`/${ignored}`) // folder root match
  );
}

/**
 * Vite builds glob keys relative to the file that calls import.meta.glob, so the
 * prefix varies: '../pages/x.astro', './x.astro' or '../x.astro' all become 'x.astro'.
 */
function stripAstroPrefix(filePath: string): string {
  return filePath.replace(/^(?:\.{1,2}\/)+(?:pages\/)?/, '');
}

// Source path for display: src/pages/...
function toSourceFile(filePath: string): string {
  return `src/pages/${stripAstroPrefix(filePath)}`;
}

/**
 * Converts an Astro file path into a URL route.
 *
 * ./error-page.astro          → /error-page
 * ../pages/blog/index.astro   → /blog
 * ./index.astro               → /
 */
export function fileToRoute(filePath: string): string {
  let route = '/' + stripAstroPrefix(filePath).replace(/\.(astro|ts|tsx|js|jsx)$/, '');

  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }

  return route || '/';
}

/**
 * Converts a TanStack Start file route into a URL. Returns null when the
 * file isn't a listable page (root, layouts, generated files, dynamic params).
 *
 * /src/app/routes/index.tsx               → /
 * /src/app/routes/auth/login.tsx          → /auth/login
 * /src/app/routes/blog.index.tsx          → /blog          (dots act as "/")
 * /src/app/routes/_layout/about.tsx       → /about         (_pathless layouts dropped)
 * /src/app/routes/(marketing)/pricing.tsx → /pricing       (route groups dropped)
 * /src/app/routes/blog.$slug.tsx          → null           (dynamic, can't be listed)
 */
export function tanstackFileToRoute(filePath: string): string | null {
  if (filePath.includes('.gen.')) return null; // routeTree.gen.ts and friends

  const base = filePath.replace(/^.*\/routes/, '').replace(/\.(tsx?|jsx?)$/, '');
  const segments = base
    .split('/')
    .flatMap((s) => s.split('.'))
    .filter(Boolean);

  // Not listable: root, layout files, "-" prefixed (ignored) files, dynamic params
  if (segments.some((s) => s === '__root' || s === 'route' || s.startsWith('-') || s.startsWith('$'))) {
    return null;
  }

  const parts = segments
    .filter((s) => s !== 'index')
    .filter((s) => !s.startsWith('_')) // pathless layouts
    .filter((s) => !/^\(.*\)$/.test(s)) // route groups
    .map((s) => s.replace(/_$/, '')); // trailing "_" = non-nested escape

  return `${TANSTACK_BASEPATH}/${parts.join('/')}`.replace(/\/+$/, '') || '/';
}

/**
 * Converts a route into a human-readable label.
 *
 * Examples:
 * /blog/post-one → "Blog › Post One"
 * /about → "About"
 */
export function toLabel(route: string): string {
  if (route === '/') return 'Home';

  return route
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\//g, ' › ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Standard structure for a discovered route
export type Route = {
  route: string; // URL path (e.g. /blog/post)
  file: string; // actual file path (for debugging/dev)
  label: string; // human-readable name
  framework?: 'astro' | 'tanstack'; // which framework renders it
};

/**
 * Scans all files and splits them into:
 * - SSR routes (regular pages, plus all TanStack Start pages)
 * - Static routes (generated via getStaticPaths or forced static)
 *
 * @param allFiles       import.meta.glob of the Astro pages
 * @param tanstackFiles  import.meta.glob of the TanStack Start routes (lazy, paths only)
 */
export async function discoverRoutes(
  allFiles: Record<string, unknown>,
  tanstackFiles: Record<string, unknown> = {}
): Promise<{ ssrRoutes: Route[]; staticRoutes: Route[]; allRoutes: Route[] }> {
  const ssrRoutes: Route[] = [];
  const staticRoutes: Route[] = [];
  const allRoutes: Route[] = [];

  /**
   * STEP 1: Add manually defined static pages
   */
  for (const filePath of STATIC_FLAT) {
    if (!(filePath in allFiles)) continue;

    const file = toSourceFile(filePath);
    const route = fileToRoute(filePath);

    staticRoutes.push({
      route,
      file,
      label: toLabel(route),
      framework: 'astro',
    });
  }

  /**
   * STEP 2: Process all discovered Astro files
   */
  for (const [filePath, mod] of Object.entries(allFiles)) {
    // Skip ignored files
    if (isIgnored(filePath)) continue;

    // Skip already handled static flat files
    if (STATIC_FLAT.includes(filePath)) continue;

    const file = toSourceFile(filePath);
    const module = mod as any;

    const hasStaticPaths = typeof module.getStaticPaths === 'function';
    const isDynamic = filePath.includes('['); // e.g. [slug].astro

    /**
     * STEP 3: Handle dynamic/static-generated routes
     */
    if (hasStaticPaths || isDynamic) {
      // If dynamic but no getStaticPaths → skip (can't resolve routes)
      if (!hasStaticPaths) continue;

      try {
        const paths = await module.getStaticPaths();

        // Expand each param combination into a real route
        for (const { params } of paths) {
          let route = fileToRoute(filePath);

          // Replace [param] with actual values
          for (const [key, value] of Object.entries(params as Record<string, string>)) {
            route = route.replace(`[${key}]`, value);
          }

          staticRoutes.push({
            route,
            file,
            label: toLabel(route),
            framework: 'astro',
          });
        }
      } catch (e) {
        console.warn(`Could not call getStaticPaths for ${filePath}:`, e);
      }

      /**
       * STEP 4: Handle normal SSR pages
       */
    } else {
      const route = fileToRoute(filePath);

      ssrRoutes.push({
        route,
        file,
        label: toLabel(route),
        framework: 'astro',
      });
    }
  }

  /**
   * STEP 4b: TanStack Start routes (rendered on the server)
   *
   * Only the file paths are used, so the glob can stay lazy and the
   * React route modules are never imported here.
   */
  for (const filePath of Object.keys(tanstackFiles)) {
    if (isIgnored(filePath)) continue;

    const route = tanstackFileToRoute(filePath);
    if (!route) continue;

    // Astro wins if both frameworks define the same URL
    if ([...ssrRoutes, ...staticRoutes].some((r) => r.route === route)) continue;

    ssrRoutes.push({
      route,
      file: filePath.replace(/^\//, ''),
      label: toLabel(route.slice(TANSTACK_BASEPATH.length) || '/'),
      framework: 'tanstack',
    });
  }

  /**
   * STEP 5: Sort routes alphabetically for clean UI output
   */
  ssrRoutes.sort((a, b) => a.route.localeCompare(b.route));
  staticRoutes.sort((a, b) => a.route.localeCompare(b.route));

  /**
   * STEP 6: Add all route
   */
  allRoutes.push(...ssrRoutes, ...staticRoutes);
  allRoutes.sort((a, b) => a.route.localeCompare(b.route));
  return { ssrRoutes, staticRoutes, allRoutes };
}

export const openApiBasePath = '/api/openapi/v1';
export const rpcBasePath = '/api/rpc';
export const ogPath = allRouters.seo.og['~orpc'].route.path; // derived from router definition
export const cspPath = allRouters.csp.cspReport['~orpc'].route.path; // derived from router definition

export const themeScriptPath = join(process.cwd(), 'src/lib/helpers/theme-checker.js');
export const manifestPath = join(process.cwd(), 'src/plugins/csp-manifest.json');
