// src/lib/env/server.env.ts
import { z } from 'zod';

// Schema for validation
const EnvSchema = z.object({
  // Database
  DB_URL: z.string().min(1, 'ENV: DB_URL is required and must be a non-empty string'),
  UPSTASH_REDIS_URL: z
    .string()
    .min(1, 'ENV: UPSTASH_REDIS_URL is required and must be a non-empty string'),
  // BetterAuth
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'ENV: BETTER_AUTH_SECRET is required and must be a non-empty string'),
  BETTER_AUTH_URL: z.string().min(1, 'ENV: BETTER_AUTH_URL is required and must be a non-empty string'),
  // Public
  PUBLIC_URL: z.string().min(1, 'ENV: PUBLIC_URL is required and must be a non-empty string'),
  PUBLIC_API_URL: z.string().min(1, 'ENV: PUBLIC_API_URL is required and must be a non-empty string'),
  // Social Auth
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, 'ENV: GOOGLE_CLIENT_ID is required and must be a non-empty string'),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, 'ENV: GOOGLE_CLIENT_SECRET is required and must be a non-empty string'),
  GITHUB_CLIENT_ID: z
    .string()
    .min(1, 'ENV: GITHUB_CLIENT_ID is required and must be a non-empty string'),
  GITHUB_CLIENT_SECRET: z
    .string()
    .min(1, 'ENV: GITHUB_CLIENT_SECRET is required and must be a non-empty string'),
  // Email
  RESEND_EMAIL: z.string().min(1, 'ENV: RESEND_EMAIL is required and must be a non-empty string'),
  // Security
  ARCJET_KEY: z.string().min(1, 'ENV: ARCJET_KEY is required and must be a non-empty string'),
  ARCJET_ENV: z.string().min(1, 'ENV: ARCJET_ENV is required and must be a non-empty string'),
  // Cloud
  CLOUD_TOKEN: z.string().min(1, 'ENV: CLOUD_TOKEN is required and must be a non-empty string'),
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test', 'preview']).default('development'),
  // AI
  QWEN_API_KEY: z.string().min(1, 'ENV: QWEN_API_KEY is required and must be a non-empty string'),
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
