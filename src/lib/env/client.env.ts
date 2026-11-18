// src/lib/env/client.env.ts
import { z } from 'zod';

// Schema for browser-exposed vars (only PUBLIC ones)
// Only include client-safe variables (prefixed with PUBLIC_)
const EnvClientSchema = z.object({
  PUBLIC_URL: z.string().min(1, 'ENV: PUBLIC_URL is required and must be a non-empty string'),
  PUBLIC_OPEN_API_BASE_PATH: z
    .string()
    .min(1, 'ENV:  OPEN_API_BASE_PATH is required and must be a non-empty string'),
  PRODUCTION: z.boolean(),
});

export type ClientEnv = z.infer<typeof EnvClientSchema>;

export function getClientEnv(): ClientEnv {
  const parsed = EnvClientSchema.parse({
    PUBLIC_URL: import.meta.env.PUBLIC_URL,
    PUBLIC_OPEN_API_BASE_PATH: import.meta.env.PUBLIC_OPEN_API_BASE_PATH,
    // Vite's built-in boolean, always defined client-side
    PRODUCTION: import.meta.env.PROD,
  });
  return parsed;
}

export const envClient = getClientEnv();
