// src/lib/helpers/reading-time.ts
export function getReadingTime(body: string | undefined): string {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return `${Math.ceil(words / 200)} `;
}

export function getReadingTimeSeconds(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.ceil(words / 200);
}
