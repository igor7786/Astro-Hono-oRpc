import type { Plugin } from 'vite';

// Why this exists:
// Astro and TanStack Start both set `builder.buildApp`. Start's overwrites Astro's, so
// Astro's manifest step never runs and the production server crashes on startup.
// These plugins keep Astro's function and run it after Start's client build.
//
// Tested with: astro 7.4.1, @tanstack/react-start 1.169.4, vite 8.3.5.
// Re-test the production build and a browser after upgrading any of them.

const START_MANIFEST_PLUGIN = 'tanstack-start:start-manifest-capture-client-build';

export function astroStartBuildPatch(): Plugin[] {
  let astroBuildApp: ((builder: any) => Promise<void>) | undefined;

  // Runs before Start's plugin (enforce: 'pre'), while `builder.buildApp` is still Astro's.
  const capture: Plugin = {
    name: 'capture-astro-build-app',
    enforce: 'pre',
    config(config) {
      astroBuildApp = config.builder?.buildApp as typeof astroBuildApp;
    },
  };

  // Runs after Start's plugin (enforce: 'post') and replaces `buildApp` with one that
  // builds Start's client bundle first, then runs Astro's full build.
  const compose: Plugin = {
    name: 'compose-astro-and-start-build-app',
    enforce: 'post',

    // Start's manifest plugin records the client build and expects exactly one entry file.
    // Astro's own client build (islands) adds more entries and would make it throw, so only
    // let it record the first client build, which is Start's.
    configResolved(config) {
      const lists = [
        config.plugins,
        ...Object.values(config.environments ?? {}).map((e: any) => e.plugins),
      ];
      const seen = new Set<any>();
      for (const list of lists) {
        for (const plugin of (list ?? []) as any[]) {
          if (plugin?.name !== START_MANIFEST_PLUGIN || seen.has(plugin)) continue;
          seen.add(plugin);
          const original = plugin.generateBundle;
          let done = false;
          plugin.generateBundle = function (this: any, ...args: any[]) {
            if (done) return;
            done = true;
            return original.apply(this, args);
          };
        }
      }
    },

    config() {
      return {
        // Don't let Astro's client build wipe Start's client bundle (see the `rm -rf dist` build script).
        environments: { client: { build: { emptyOutDir: false } } },
        builder: {
          async buildApp(builder: any) {
            const client = builder.environments.client;
            if (!client.isBuilt) await builder.build(client); // Start's client bundle
            if (astroBuildApp) await astroBuildApp(builder); // Astro's full build + manifest
          },
        },
      };
    },
  };

  return [capture, compose];
}
