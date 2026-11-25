import { createFileRoute } from '@tanstack/react-router';

import TestClients from '@/app/components/TestClients';

export const Route = createFileRoute('/testo/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TestClients />
    </div>
  );
}
