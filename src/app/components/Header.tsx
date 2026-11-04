import { Link } from '@tanstack/react-router';

import { ModeToggle } from '@app/components/mode-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold tracking-wider text-amber-500 uppercase">
            Admin Portal
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link
            to="/register"
            className="transition-colors hover:text-foreground [&.active]:text-foreground"
          >
            Dashboard
          </Link>
          <a
            href="/api/rpc/openapi/v1/tests/clients"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            oRPC Client Test
          </a>
          <ModeToggle className="size-14 rounded-lg border-amber-200 bg-transparent text-2xl text-slate-500 hover:bg-amber-300/10" />
        </nav>
      </div>
    </header>
  );
}
