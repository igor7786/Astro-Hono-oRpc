import { cn } from '@rcomp/lib/utils';
import { Badge } from '@rcomp/ui/badge';
import { Button } from '@rcomp/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@rcomp/ui/card';
import { Separator } from '@rcomp/ui/separator';

import type { ErrorCardProps } from '@/lib/shared/schemas/errors/page.errors';

export function ErrorCard({ href, code, title, message, requestId, isServerError }: ErrorCardProps) {
  const accentText = isServerError ? 'text-error-server' : 'text-error-client';
  const accentBg = isServerError ? 'bg-error-server' : 'bg-error-client';
  const accentBorder = isServerError ? 'border-error-server-dim' : 'border-error-client-dim';

  return (
    <main className="relative flex min-h-[calc(100vh-2rem)] w-full items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl',
          accentBg
        )}
      />

      <section className="relative w-full max-w-2xl" aria-labelledby="error-title">
        <Card className="overflow-hidden rounded-2xl border border-border bg-panel/90 py-0 shadow-2xl shadow-black/20 backdrop-blur-xl transition-colors duration-200 hover:border-primary">
          <CardHeader className="items-center gap-0 border-b border-white/10 px-5 py-3">
            <div className="flex w-full flex-row items-center justify-between">
              {/* Left Corner */}
              <div className="flex items-center gap-2">
                <span
                  className={cn('absolute top-4 left-1.75 size-2 animate-pulse rounded-full', accentBg)}
                />
                <span className="font-mono text-xs text-ink-muted">fast-web-tech.co.uk</span>
              </div>

              {/* Right Corner */}
              <span className="font-mono text-xs text-green-600">HTTP/3</span>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-10 sm:px-10 sm:py-12">
            {/* Status */}
            <div className="mb-8 flex items-end gap-4">
              <span
                className={cn('font-mono text-6xl font-bold tracking-tighter sm:text-8xl', accentText)}
              >
                {code}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'mb-2 rounded-md px-2 py-1 font-mono text-[10px] tracking-widest uppercase',
                  accentBorder,
                  accentText
                )}
              >
                error
              </Badge>
            </div>

            <Separator className={cn('mb-8 border-t border-dashed bg-transparent', accentBorder)} />

            {/* Message */}
            <div className="max-w-xl">
              <h1
                id="error-title"
                className="mb-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                {title}
              </h1>
              <p className="leading-7 text-ink-muted">{message}</p>
            </div>

            {/* Request metadata */}
            <Card className="mt-10 gap-0 overflow-hidden rounded-xl border-white/10 bg-black/20 py-0">
              <CardHeader className="flex-row items-center justify-between gap-0 border-b border-white/10 px-4 py-3">
                <span className="font-mono text-[11px] tracking-wider text-ink-muted uppercase">
                  Request Metadata
                </span>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2 font-mono text-xs sm:flex-row sm:items-center">
                  <span className="text-ink-muted">request-id:</span>
                  <code className="break-all text-ink">{requestId}</code>
                </div>
              </CardContent>
            </Card>
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-3 border-t border-white/10 px-6 py-6 sm:flex-row sm:px-10">
            <Button
              nativeButton={false}
              render={
                <a
                  href={href}
                  aria-label="Back to fast-web-tech.co.uk"
                  className="inline-flex items-center justify-center gap-2"
                />
              }
              className="bg-amber-500 text-background transition-all hover:bg-amber-600 hover:opacity-90"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-6 w-6 -translate-y-px items-center justify-center leading-none"
              >
                ←
              </span>
              Back to fast-web-tech.co.uk
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-3 px-1 font-mono text-[10px] text-ink-muted">powered by Astro + Hono + oRPC</p>
      </section>
    </main>
  );
}
