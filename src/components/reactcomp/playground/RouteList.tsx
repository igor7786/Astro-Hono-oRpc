import { cn } from '@rcomp/lib/utils';

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
    badge: 'bg-primary/10 text-primary border-primary/20',
    text: 'text-muted-foreground',
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
    text: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-primary',
    hoverText: 'hover:text-primary',
  },
};

export function RouteListCard({ accent, badgeLabel, title, items, masked }: RouteListCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="flex w-full flex-row items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-foreground flex items-center gap-2 font-semibold">
          <span className={cn('rounded border px-2 py-0.5 text-xs font-medium', styles.badge)}>
            {badgeLabel}
          </span>
          {title}
          <span className="text-muted-foreground text-sm font-normal">({items.length})</span>
        </h2>
      </div>

      <div className="p-4">
        <ul className="space-y-1.5">
          {items.map(({ route, label, iconHtml }) => (
            <li key={route}>
              <a
                href={route}
                className={cn(
                  'grid grid-cols-12 items-center rounded-lg border border-white/5 bg-white/[0.01] px-4 py-2 text-sm transition-all duration-200',
                  styles.hoverBorder,
                  styles.hoverText,
                  'hover:bg-white/[0.03]'
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
      </div>
    </div>
  );
}
