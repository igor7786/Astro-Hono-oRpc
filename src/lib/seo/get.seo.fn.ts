import { createServerFn } from '@tanstack/react-start';

import { resolveSeo } from '@/lib/seo/seo.core';

type SeoInput = Record<string, unknown> & { pathname: string };

export const getSeo = createServerFn({ method: 'GET' })
  .validator((input: SeoInput) => input)
  .handler(({ data }) => {
    const { pathname, ...props } = data;
    return resolveSeo(props, pathname);
  });
