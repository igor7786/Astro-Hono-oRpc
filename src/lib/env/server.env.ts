// src/lib/env/server.env.ts
import { z } from 'zod';

// Schema for validation
const EnvSchema = z.object({
  // General
  PRODUCTION: z.string().min(1, 'ENV: PRODUCTION is required and must be a non-empty string'),
  // Database
  DB_URL: z.string().min(1, 'ENV: DB_URL is required and must be a non-empty string'),
  UPSTASH_REDIS_URL: z
    .string()
    .min(1, 'ENV: UPSTASH_REDIS_URL is required and must be a non-empty string'),
  VPS_REDIS_URL: z.string().min(1, 'ENV: VPS_REDIS_URL is required and must be a non-empty string'),
  VPS_TLS_SERVER: z.string().min(1, 'ENV: VPS_TLS_SERVER is required and must be a non-empty string'),
  VPS_CA_CERT: z.string().min(1, 'ENV: VPS_CA_CERT is required and must be a non-empty string'),
  VPS_CLIENT_CERT: z.string().min(1, 'ENV: VPS_CLIENT_CERT is required and must be a non-empty string'),
  VPS_CLIENT_KEY: z.string().min(1, 'ENV: VPS_CLIENT_KEY is required and must be a non-empty string'),
  // Vps Postgres
  VPS_PG_HOST: z.string().min(1, 'ENV: VPS_PG_HOST is required and must be a non-empty string'),
  VPS_PG_PORT: z.coerce.number().min(1, 'ENV: VPS_PG_PORT is required and must be a non-empty string'),
  VPS_PG_USER: z.string().min(1, 'ENV: VPS_PG_USER is required and must be a non-empty string'),
  VPS_PG_PASS: z.string().min(1, 'ENV: VPS_PG_PASS is required and must be a non-empty string'),
  VPS_PG_DB: z.string().min(1, 'ENV: VPS_PG_DB is required and must be a non-empty string'),
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
  // RustFS
  RUSTFS_ACCESS_KEY: z
    .string()
    .min(1, 'ENV: RUSTFS_ACCESS_KEY is required and must be a non-empty string'),
  RUSTFS_SECRET_KEY: z
    .string()
    .min(1, 'ENV: RUSTFS_SECRET_KEY is required and must be a non-empty string'),
  RUSTFS_ENDPOINT: z.string().min(1, 'ENV: RUSTFS_ENDPOINT is required and must be a non-empty string'),
  // Red-panda,Kafka
  VPS_KAFKA_BROKERS_DEV: z
    .string()
    .min(1, 'ENV: VPS_KAFKA_BROKERS_DEV is required and must be a non-empty string'),
  VPS_KAFKA_BROKERS_PROD: z
    .string()
    .min(1, 'ENV: VPS_KAFKA_BROKERS_PROD is required and must be a non-empty string'),
  KAFKA_USERNAME: z.string().min(1, 'ENV: KAFKA_USERNAME is required and must be a non-empty string'),
  KAFKA_PASSWORD: z.string().min(1, 'ENV: KAFKA_PASSWORD is required and must be a non-empty string'),
  // Tinybird
  TINYBIRD_URL: z.string().min(1, 'ENV: TINYBIRD_URL is required and must be a non-empty string'),
  TINYBIRD_TOKEN: z.string().min(1, 'ENV: TINYBIRD_TOKEN is required and must be a non-empty string'),
});

// Type inferred from schema

// Load & validate environment vars from process.env
export function getServerEnv(): EnvServer {
  const envSource = typeof Bun !== 'undefined' ? Bun.env : process.env;
  const parsed = EnvSchema.parse(envSource);
  return parsed;
}

// Export parsed env
export const envServer = getServerEnv();
export type EnvServer = z.infer<typeof EnvSchema>;
