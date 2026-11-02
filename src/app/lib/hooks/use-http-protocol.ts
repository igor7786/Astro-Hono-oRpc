import { useSyncExternalStore } from 'react';

const LABELS: Record<string, string> = {
  h3: 'HTTP/3',
  h2: 'HTTP/2',
  'http/1.1': 'HTTP/1.1',
  'http/1.0': 'HTTP/1.0',
};

function formatProtocol(raw: string): string {
  if (!raw) return 'unknown';
  if (LABELS[raw]) return LABELS[raw];
  return raw.startsWith('h3') ? 'HTTP/3' : raw; // draft names like "h3-29"
}

let cached: string | null = null;

function getSnapshot(): string {
  cached ??= formatProtocol(
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.nextHopProtocol ?? ''
  );
  return cached;
}

const getServerSnapshot = (): null => null;
const subscribe = () => () => {}; // the value never changes during a page load

export function useHttpProtocol(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
