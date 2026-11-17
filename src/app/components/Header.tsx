import { Link } from '@tanstack/react-router';

import { ModeToggle } from '@app/components/mode-toggle';

import { Button } from '@rcomp/ui/button';

import { appContract } from '@/server/contracts/all.contracts';

const clientsTestHref = `/api/rpc/openapi/v1${appContract.tests.testClients['~orpc'].route.path}`;

const navButtonClass =
  'h-14 rounded-lg border-amber-200 bg-transparent px-2.5 text-center text-xs font-medium whitespace-nowrap text-slate-500 hover:bg-amber-300/10 hover:text-foreground sm:px-4 sm:text-sm dark:text-slate-400 [&.active]:bg-amber-300/15 [&.active]:text-foreground';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
        <div className="flex shrink-0 items-center">
          <span className="rounded bg-amber-500/10 px-2 py-1 text-center font-mono text-[10px] font-bold tracking-wider whitespace-nowrap text-amber-500 uppercase sm:text-xs">
            Admin Portal
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/register" />}
            className={navButtonClass}
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={clientsTestHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="oRPC Client Test"
              />
            }
            className={navButtonClass}
          >
            oRPC Client Test
          </Button>
          <ModeToggle className="size-14 shrink-0 rounded-lg border-amber-200 bg-transparent text-2xl text-slate-500 hover:bg-amber-300/10" />
        </nav>
      </div>
    </header>
  );
}
