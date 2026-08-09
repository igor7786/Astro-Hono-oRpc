// @/server/schemas/clients.schema.ts
import { z } from 'zod';

// Reusable shape for a single client's health status
const clientStatusSchema = z.object({
  name: z.string().trim(),
  connected: z.boolean(),
  message: z.string().trim(),
  latencyMs: z.number().nonnegative().optional(),
  checkedAt: z.string().datetime(),
});

export type ClientStatus = z.infer<typeof clientStatusSchema>;

export const testClientSchema = z.object({
  sqlite: clientStatusSchema,
  pg: clientStatusSchema,
  kafka: clientStatusSchema,
  redis: clientStatusSchema,
  s3: clientStatusSchema,
});

export type TestClientSchema = z.infer<typeof testClientSchema>;
