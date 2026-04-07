// src/lib/env/client.env.ts
import { z } from 'zod';

// Schema for browser-exposed vars (only PUBLIC ones)
// Only include client-safe variables (prefixed with PUBLIC_)
const EnvClientSchema = z.object({
  PUBLIC_URL: z.string().min(1, 'ENV: PUBLIC_URL is required and must be a non-empty string'),
  PUBLIC_API_URL: z.string().min(1, 'ENV: PUBLIC_API_URL is required and must be a non-empty string')
});

export type ClientEnv = z.infer<typeof EnvClientSchema>;

export function getClientEnv(): ClientEnv {
  const parsed = EnvClientSchema.parse({
    PUBLIC_URL: import.meta.env.PUBLIC_URL,
    PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
  });
  return parsed;
}

export const envClient = getClientEnv();
