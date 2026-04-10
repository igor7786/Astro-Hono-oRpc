// src/lib/server/seo/og/SocialCard.tsx
export interface SocialCardProps {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  siteName?: string;
  siteUrl?: string;
}

const LightningIcon = (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      fill="#facc15"
      stroke="#facc15"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonIcon = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="#4ade80"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={12}
      cy={7}
      r={4}
      stroke="#4ade80"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <rect
      x={3}
      y={4}
      width={18}
      height={18}
      rx={2}
      ry={2}
      stroke="#fb923c"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1={16} y1={2} x2={16} y2={6} stroke="#fb923c" strokeWidth={2} strokeLinecap="round" />
    <line x1={8} y1={2} x2={8} y2={6} stroke="#fb923c" strokeWidth={2} strokeLinecap="round" />
    <line x1={3} y1={10} x2={21} y2={10} stroke="#fb923c" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export function SocialCard({
  title,
  description,
  author,
  date,
  siteName = 'Fast Web Tech',
  siteUrl = 'fast-web-tech.co.uk',
}: SocialCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 1200,
        height: 630,
        backgroundColor: '#0f172a',
        fontFamily: 'Inter, sans-serif',
        color: '#ffffff',
      }}
    >
      {/* ✅ accent line */}
      <div
        style={{
          display: 'flex',
          height: 6,
          background: 'linear-gradient(90deg, #60a5fa, #4ade80, #fb923c)',
        }}
      />

      {/* ✅ main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: 64,
        }}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {LightningIcon}
          <span style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#60a5fa' }}>
            {siteName}
          </span>
          <span
            style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.75)', marginLeft: 8 }}
          >
            {siteUrl}
          </span>
        </div>

        {/* CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.5,
                maxWidth: 900,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {(author || date) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 22 }}>
            {author && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 600,
                  color: '#4ade80',
                }}
              >
                {PersonIcon}
                <span style={{ display: 'flex' }}>{author}</span>
              </div>
            )}
            {author && date && (
              <span style={{ display: 'flex', color: 'rgba(255,255,255,0.5)' }}>•</span>
            )}
            {date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fb923c' }}>
                {CalendarIcon}
                <span style={{ display: 'flex' }}>{date}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
