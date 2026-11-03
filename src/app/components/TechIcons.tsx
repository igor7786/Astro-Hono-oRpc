import { technologies } from '@app/lib/icons/static-icons-map';

import { Card, CardContent } from '@rcomp/ui/card';

export default function TechIcons() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-6 text-center">
      <h1 className="mx-auto mb-2 text-6xl font-bold text-zinc-700">Welcome</h1>
      <p className="mb-12 text-xl text-muted-foreground">Browse all available pages</p>

      <Card className="mb-6 border border-border bg-slate-900 transition-colors hover:border-amber-50">
        <CardContent className="flex flex-wrap items-center justify-center gap-3 p-4 md:gap-4">
          {technologies.map(({ name, Icon }) => (
            <div
              key={name}
              title={name}
              className="flex items-center justify-center rounded-lg border border-border px-4 py-4 transition-colors hover:border-primary"
            >
              {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
              <Icon width={48} height={48} aria-label={name} role="img" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
