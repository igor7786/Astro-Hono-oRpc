export interface SocialCardProps {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  siteName?: string;
  siteUrl?: string;
}

const colors = {
  bg: '#0f172a',
  primary: '#60a5fa',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.75)',
  yellow: '#facc15',
  green: '#4ade80',
  orange: '#fb923c',
};

const el = (type: string, props: Record<string, any>, ...children: any[]) => ({
  type,
  props: {
    ...props,
    children: children.flat().filter((c) => c != null && c !== false && c !== ''),
  },
});

const LightningIcon = el(
  'svg',
  { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none' },
  el('path', {
    d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    fill: '#facc15',
    stroke: '#facc15',
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  })
);

const PersonIcon = el(
  'svg',
  { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' },
  el('path', {
    d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
    stroke: '#4ade80',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
  el('circle', {
    cx: 12,
    cy: 7,
    r: 4,
    stroke: '#4ade80',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  })
);

const CalendarIcon = el(
  'svg',
  { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none' },
  el('rect', {
    x: 3,
    y: 4,
    width: 18,
    height: 18,
    rx: 2,
    ry: 2,
    stroke: '#fb923c',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
  el('line', {
    x1: 16,
    y1: 2,
    x2: 16,
    y2: 6,
    stroke: '#fb923c',
    strokeWidth: 2,
    strokeLinecap: 'round',
  }),
  el('line', { x1: 8, y1: 2, x2: 8, y2: 6, stroke: '#fb923c', strokeWidth: 2, strokeLinecap: 'round' }),
  el('line', {
    x1: 3,
    y1: 10,
    x2: 21,
    y2: 10,
    stroke: '#fb923c',
    strokeWidth: 2,
    strokeLinecap: 'round',
  })
);

export function SocialCard({
  title,
  description,
  author,
  date,
  siteName = 'Fast Web Tech',
  siteUrl = 'fast-web-tech.co.uk',
}: SocialCardProps) {
  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: 1200,
        height: 630,
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },

    // ✅ accent line — top row, full width
    el('div', {
      style: {
        display: 'flex',
        width: 1200,
        height: 6,
        background: 'linear-gradient(90deg, #60a5fa, #4ade80, #fb923c)',
      },
    }),

    // ✅ main content — padded area
    el(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: 64,
        },
      },

      // HEADER
      el(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 12 } },
        LightningIcon,
        el(
          'span',
          {
            style: { display: 'flex', fontWeight: 700, fontSize: 28, color: colors.primary },
          },
          siteName
        ),
        el(
          'span',
          {
            style: { display: 'flex', fontSize: 18, color: colors.muted, marginLeft: 8 },
          },
          siteUrl
        )
      ),

      // CONTENT
      el(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
        el(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: colors.text,
            },
          },
          title
        ),
        description &&
          el(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: 26,
                color: colors.muted,
                lineHeight: 1.5,
                maxWidth: 900,
              },
            },
            description
          )
      ),

      // FOOTER
      (author || date) &&
        el(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 24, fontSize: 22 } },
          author &&
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 600,
                  color: colors.green,
                },
              },
              PersonIcon,
              el('span', { style: { display: 'flex' } }, author)
            ),
          date && author && el('span', { style: { display: 'flex', color: colors.muted } }, '•'),
          date &&
            el(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: 10, color: colors.orange } },
              CalendarIcon,
              el('span', { style: { display: 'flex' } }, date)
            )
        )
    )
  );
}
