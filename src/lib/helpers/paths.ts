// Files/folders to ignore globally when scanning routes
export const IGNORED_FILES = ['og', '_', 'api', 'robots'];

// Specific files to ignore exactly (full path match)
export const IGNORED_EXACT = ['../pages/index.astro'];

// Pages that should always be treated as static (even if not dynamic)
export const STATIC_FLAT = [
  '../pages/playground/blog/index.astro',
  // add flat prerender=true pages here
];

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
 * Converts a file path into a URL route.
 *
 * Examples:
 * ../pages/blog/index.astro → /blog
 * ../pages/about.astro → /about
 *
 * Steps:
 * - Remove "../pages" prefix
 * - Remove file extension
 * - Remove trailing "/index"
 * - Ensure root becomes "/"
 */
export function fileToRoute(filePath: string): string {
  let route = filePath.replace('../pages', '').replace(/\.(astro|ts|tsx|js|jsx)$/, '');

  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }

  return route || '/';
}

/**
 * Converts a route into a human-readable label.
 *
 * Examples:
 * /blog/post-one → "Blog › Post One"
 * /about → "About"
 *
 * Steps:
 * - Remove leading slash
 * - Replace "-" with spaces
 * - Replace "/" with breadcrumb separator
 * - Capitalize each word
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
};

/**
 * Main function that scans all files and splits them into:
 * - SSR routes (regular pages)
 * - Static routes (generated via getStaticPaths or forced static)
 *
 * Handles:
 * - Ignored files
 * - Static flat pages
 * - Dynamic routes ([slug])
 * - getStaticPaths resolution
 */
export async function discoverRoutes(
  allFiles: Record<string, unknown>
): Promise<{ ssrRoutes: Route[]; staticRoutes: Route[]; allRoutes: Route[] }> {
  const ssrRoutes: Route[] = [];
  const staticRoutes: Route[] = [];
  const allRoutes: Route[] = [];

  /**
   * STEP 1: Add manually defined static pages
   *
   * These are explicitly listed and bypass normal detection.
   */
  for (const filePath of STATIC_FLAT) {
    if (!(filePath in allFiles)) continue;

    const file = filePath.replace('../pages/', 'src/pages/');
    const route = fileToRoute(filePath);

    staticRoutes.push({
      route,
      file,
      label: toLabel(route),
    });
  }

  /**
   * STEP 2: Process all discovered files
   */
  for (const [filePath, mod] of Object.entries(allFiles)) {
    // Skip ignored files
    if (isIgnored(filePath)) continue;

    // Skip already handled static flat files
    if (STATIC_FLAT.includes(filePath)) continue;

    const file = filePath.replace('../pages/', 'src/pages/');
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
      });
    }
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
