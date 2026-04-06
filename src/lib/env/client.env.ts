// src/lib/env/client.env.ts
import { z } from 'zod';

// Schema for browser-exposed vars (only PUBLIC ones)
// Only include client-safe variables (prefixed with PUBLIC_)
const EnvClientSchema = z.object({
  PUBLIC_URL: z.string().url(),
  PUBLIC_API_URL: z.string().url(),
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
