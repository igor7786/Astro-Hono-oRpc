import { z } from 'zod';

export const testClientSchema = z.object({
  sqliteStatus: z.string().trim(),
  pgStatus: z.string().trim(),
  kafkaStatus: z.string().trim(),
  redisStatus: z.string().trim(),
  s3Status: z.string().trim(),
});

export type TestClientSchema = z.infer<typeof testClientSchema>;
