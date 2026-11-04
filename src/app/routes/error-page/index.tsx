import { createFileRoute, redirect } from '@tanstack/react-router';

import { getErrorPage } from '@app/lib/get.error.page.fn';
import { z } from 'zod';

import { ErrorCard } from '@rcomp/playground/ErrorPage';

import { buildSeoHead } from '@/lib/seo/build.seo.head';
import { getSeo } from '@/lib/seo/get.seo.fn';
import { ErrorCodeSchema } from '@/lib/shared/schemas/errors/page.errors';

export const Route = createFileRoute('/error-page/')({
  // Non-numeric input becomes 0, which is never a valid code, so it is redirected too
  validateSearch: z.object({
    code: z.coerce.number().int().catch(0),
  }),

  // Unknown codes (599, 0, abc...) go to the canonical 404 URL
  beforeLoad: ({ search }) => {
    if (!ErrorCodeSchema.safeParse(String(search.code)).success) {
      throw redirect({ to: '/error-page', search: { code: 404 } });
    }
  },

  loaderDeps: ({ search }) => ({ code: search.code }),
  loader: async ({ deps }) => {
    const page = await getErrorPage({ data: String(deps.code) });

    const seo = await getSeo({
      data: {
        title: `${page.code} — ${page.title}`,
        description: page.message,
        type: 'website',
        pathname: '/error-page',
      },
    });

    return { page, seo };
  },
  head: ({ loaderData }) => buildSeoHead(loaderData?.seo),
  component: ErrorPage,
});

function ErrorPage() {
  const { page } = Route.useLoaderData();
  return <ErrorCard {...page} />;
}
