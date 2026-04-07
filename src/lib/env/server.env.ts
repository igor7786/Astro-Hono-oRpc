// src/lib/env/server.env.ts

import { z } from 'zod';
// Schema for validation
const EnvSchema = z.object({
  DB_URL: z.string().min(1, 'DB_URL is required and must be a non-empty string'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required and must be a non-empty string'),
  BETTER_AUTH_URL: z.string().min(1, 'BETTER_AUTH_URL is required and must be a non-empty string'),
  PUBLIC_URL: z.string().min(1, 'PUBLIC_URL is required and must be a non-empty string'),
  PUBLIC_API_URL: z.string().min(1, 'PUBLIC_API_URL is required and must be a non-empty string'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required and must be a non-empty string'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required and must be a non-empty string'),
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required and must be a non-empty string'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required and must be a non-empty string'),
  RESEND_EMAIL: z.string().min(1, 'RESEND_EMAIL is required and must be a non-empty string'),
  UPSTASH_REDIS_URL: z.string().min(1, 'UPSTASH_REDIS_URL is required and must be a non-empty string'),
  ARCJET_KEY: z.string().min(1, 'ARCJET_KEY is required and must be a non-empty string'),
  ARCJET_ENV: z.string().min(1, 'ARCJET_ENV is required and must be a non-empty string'),
  CLOUD_TOKEN: z.string().min(1, 'CLOUD_TOKEN is required and must be a non-empty string'),
  NODE_ENV: z.enum(['development', 'production', 'test', 'preview']).default('development'),
  QWEN_API_KEY: z.string().min(1, 'QWEN_API_KEY is required and must be a non-empty string'),
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
