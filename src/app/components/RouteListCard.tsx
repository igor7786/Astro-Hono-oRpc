import { useHttpProtocol } from '@app/lib/hooks/use-http-protocol';
import { technologies } from '@app/lib/icons/static-icons-map';

import { cn } from '@rcomp/lib/utils';
import { Card, CardContent, CardHeader } from '@rcomp/ui/card';

type RouteAccent = 'ssr' | 'static' | 'admin';

export interface RouteItem {
  route: string;
  label: string;
  size?: number;
}

interface Props {
  accent: RouteAccent;
  badgeLabel: string;
  title: string;
  items: RouteItem[];
  masked?: boolean;
}

const accentStyles: Record<
  RouteAccent,
  { badge: string; text: string; hoverBorder: string; hoverText: string }
> = {
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

export function RouteListCard({ accent, badgeLabel, title, items, masked }: Props) {
  const styles = accentStyles[accent];
  const protocol = useHttpProtocol();

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-panel/90 py-0 shadow-2xl backdrop-blur-xl hover:border-white">
      <CardHeader className="items-center gap-0 border-b border-white/10 px-4 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className={cn('rounded border px-2 py-0.5 text-xs font-medium', styles.badge)}>
              {badgeLabel}
            </span>

            {title}

            <span className="text-sm font-normal text-neutral-100">({items.length})</span>
          </h2>

          <span className="font-mono text-xs text-neutral-500">{protocol ?? '...'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ul className="space-y-1.5">
          {items.map(({ route, label, size }) => {
            const technology = technologies.find((item) => item.route === route);

            const Icon = technology?.icon;
            const iconSize = size ?? technology?.size ?? 16;

            return (
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
                  <div className="col-span-7 flex min-w-0 items-center gap-3">
                    {Icon && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <Icon width={iconSize} height={iconSize} className={styles.text} />
                      </div>
                    )}

                    <span className={cn('truncate font-mono text-xs', styles.text)}>
                      {masked ? '----------' : route}
                    </span>
                  </div>

                  <span className="col-span-5 truncate pl-4 text-right font-mono text-[11px] tracking-tight text-neutral-500">
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
