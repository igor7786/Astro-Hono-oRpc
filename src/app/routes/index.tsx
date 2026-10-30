import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@rcomp/auth/LoginPage';
export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return <LoginPage />;
}
