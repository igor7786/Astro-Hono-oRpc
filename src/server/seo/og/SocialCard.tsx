export interface SocialCardProps {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  siteName?: string;
  siteUrl?: string;
}

export function SocialCard({
  title,
  description,
  author,
  date,
  siteName = 'Fast Web Tech',
  siteUrl = 'fast-web-tech.co.uk',
}: SocialCardProps) {
  return (
    <div tw="flex flex-col w-[1200px] h-[630px] bg-slate-900 text-white font-sans">
      {/* Accent line */}
      <div tw="flex h-[6px] bg-gradient-to-r from-blue-400 via-green-400 to-orange-400" />

      {/* Main */}
      <div tw="flex flex-col justify-between flex-1 p-16">
        {/* HEADER */}
        <div tw="flex items-center gap-3">
          <span tw="text-[28px]">⚡</span>

          <span tw="text-[28px] font-bold text-blue-400">{siteName}</span>

          <span tw="text-[18px] text-white/75 ml-2">{siteUrl}</span>
        </div>

        {/* CONTENT */}
        <div tw="flex flex-col gap-5 items-center text-center justify-center flex-1">
          <div tw="flex items-center justify-center text-[64px] font-extrabold leading-tight tracking-tight gap-4">
            <span>{title}</span>
            <span>🚀</span>
          </div>

          {description && (
            <div tw="text-[26px] text-white/75 leading-relaxed max-w-[900px]">{description}</div>
          )}
        </div>

        {/* FOOTER */}
        {(author || date) && (
          <div tw="flex items-center gap-6 text-[22px]">
            {author && (
              <div tw="flex items-center gap-2 font-semibold text-green-400">
                <span>👤</span>
                <span>{author}</span>
              </div>
            )}

            {author && date && <span tw="text-white/50">•</span>}

            {date && (
              <div tw="flex items-center gap-2 text-orange-400">
                <span>📅</span>
                <span>{date}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
