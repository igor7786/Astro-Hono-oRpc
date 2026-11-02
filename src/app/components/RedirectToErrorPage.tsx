// src/app/components/RedirectToErrorPage.tsx
import { useEffect } from 'react';

export function RedirectToErrorPage({ code }: { code: number }) {
  useEffect(() => {
    window.location.replace(`/error-page?code=${code}`);
  }, [code]);

  return null;
}
