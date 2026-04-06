// src/lib/env.server.ts

import { z } from 'zod';
// Schema for validation
const EnvSchema = z.object({
  DB_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  PUBLIC_URL: z.string().url(),
  PUBLIC_API_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  RESEND_EMAIL: z.string().min(1),
  UPSTASH_REDIS_URL: z.string().min(1),
  ARCJET_KEY: z.string().min(1),
  ARCJET_ENV: z.string().min(1),
  CLOUD_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test', 'preview']).default('development'),
  QWEN_API_KEY: z.string().min(1),
});

// Type inferred from schema
export type ServerEnv = z.infer<typeof EnvSchema>;


// Load & validate environment vars from process.env
export function getServerEnv(): ServerEnv {
  const envSource = typeof Bun !== 'undefined' ? Bun.env : process.env;
  const parsed = EnvSchema.parse(envSource);
  return parsed;
}

// Export parsed env
export const envServer = getServerEnv();
