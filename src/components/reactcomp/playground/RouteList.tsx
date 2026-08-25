import { cn } from '@rcomp/lib/utils';
// Import Shadcn Card Components
import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

type RouteAccent = 'ssr' | 'static' | 'admin';

interface RouteItem {
  route: string;
  label: string;
  icon?: string;
  iconHtml?: string | null;
  size?: number;
}

interface RouteListCardProps {
  accent: RouteAccent;
  badgeLabel: string;
  title: string;
  items: RouteItem[];
  masked?: boolean;
}

interface AccentStyleValue {
  badge: string;
  text: string;
  hoverBorder: string;
  hoverText: string;
}

const accentStyles: Record<RouteAccent, AccentStyleValue> = {
  ssr: {
    badge: 'bg-primary/10 text-white border-primary/20',
    text: 'text-white',
    hoverBorder: 'hover:border-primary',
    hoverText: 'hover:text-primary',
  },
  static: {
    badge: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
    text: 'text-green-600 dark:text-green-400',
    hoverBorder: 'hover:border-primary',
    hoverText: 'hover:text-primary',
  },
  admin: {
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    text: 'text-white dark:text-blue-400',
    hoverBorder: 'hover:border-primary',
    hoverText: 'hover:text-primary',
  },
};

export function RouteListCard({ accent, badgeLabel, title, items, masked }: RouteListCardProps) {
  const styles = accentStyles[accent];

  return (
    /* FIXED: Replaced standard div wrapper with Shadcn Card */
    <Card className="bg-panel/90 flex flex-col overflow-hidden rounded-xl border border-white/10 py-0 shadow-2xl backdrop-blur-xl">
      {/* FIXED: Replaced internal layout div with Shadcn CardHeader */}
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-white flex items-center gap-2 font-semibold text-sm">
            <span className={cn('rounded border px-2 py-0.5 text-xs font-medium', styles.badge)}>
              {badgeLabel}
            </span>
            {title}
            <span className="text-neutral-100 text-sm font-normal">({items.length})</span>
          </h2>

          {/* Right Corner element added for total style synergy with other cards */}
          <span className="font-mono text-xs text-neutral-500">HTTP/3</span>
        </div>
      </CardHeader>

      {/* FIXED: Replaced padding wrapper with Shadcn CardContent */}
      <CardContent className="p-4">
        <ul className="space-y-1.5">
          {items.map(({ route, label, iconHtml }) => (
            <li key={route}>
              <a
                href={route}
                className={cn(
                  'grid grid-cols-12 items-center rounded-lg border border-white/5 bg-white/1 px-4 py-2 text-sm transition-all duration-200',
                  styles.hoverBorder,
                  styles.hoverText,
                  'hover:bg-white/10'
                )}
              >
                {/* Left Side: Route Path (Takes up 7 out of 12 columns) */}
                <div className="col-span-7 flex items-center gap-3 min-w-0">
                  {iconHtml && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <span
                        className={cn('inline-flex items-center [&>svg]:h-4 [&>svg]:w-4', styles.text)}
                        dangerouslySetInnerHTML={{ __html: iconHtml }}
                      />
                    </div>
                  )}
                  <span className={cn('font-mono text-xs truncate', styles.text)}>
                    {masked ? '----------' : route}
                  </span>
                </div>

                {/* Right Side: Descriptive Breadcrumb Label (Takes up 5 out of 12 columns) */}
                <span className="col-span-5 text-right font-mono text-[11px] text-neutral-500 tracking-tight truncate pl-4">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
