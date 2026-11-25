import { createFileRoute } from '@tanstack/react-router';

import { GeoDebugCard } from '@/app/components/GeoDebugCard';

export const Route = createFileRoute('/testo/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GeoDebugCard />
    </div>
  );
}
