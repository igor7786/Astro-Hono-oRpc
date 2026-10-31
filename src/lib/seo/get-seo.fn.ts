// src/lib/seo/get-seo.fn.ts
import { createServerFn } from '@tanstack/react-start';

import z from 'zod';

import { generateOgParamsId, generateOgToken } from '@/lib/crypto/og.image.id.url';
import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import { ogImages } from '@/lib/drizzle/neon/schemas';
import { envServer } from '@/lib/env/server.env';
import { ogPath, openApiBasePath } from '@/lib/helpers/paths';
import { baseSeo, seoSchema } from '@/lib/shared/schemas/seo/seo.schema';

type SeoInput = Record<string, unknown> & { pathname: string };

export const getSeo = createServerFn({ method: 'GET' })
  .validator((input: SeoInput) => input) // older versions: .validator(...)
  .handler(async ({ data }) => {
    const { pathname, ...props } = data;

    const result = seoSchema.safeParse({
      ...baseSeo,
      ...props,
      siteUrl: new URL(pathname, envServer.PUBLIC_URL).toString(),
    });
    if (!result.success) {
      console.error('[SEO] Invalid props:', z.treeifyError(result.error));
    }
    const seo = result.success ? result.data : seoSchema.parse(baseSeo);
    const { title, description, author, date, type, siteName, siteUrl } = seo;

    const id = generateOgParamsId({ title, description, author, date });
    const token = generateOgToken(id);

    try {
      // One round trip instead of select + insert
      await neonDb
        .insert(ogImages)
        .values({ id, token, title, description, author, date })
        .onConflictDoNothing({ target: ogImages.id });
    } catch (error) {
      console.error('[error] NeonDB unavailable 📛', error);
    }

    const ogUrl = new URL(openApiBasePath + ogPath, envServer.PUBLIC_URL);
    ogUrl.searchParams.set('id', id);
    ogUrl.searchParams.set('format', 'png');

    return { title, description, author, date, type, siteName, siteUrl, ogImageUrl: ogUrl.toString() };
  });

export type SeoData = Awaited<ReturnType<typeof getSeo>>;
