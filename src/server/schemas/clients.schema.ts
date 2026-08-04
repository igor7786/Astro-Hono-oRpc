import { z } from 'zod';

export const testClientSchema = z.object({
  status: z.string().trim(),
});

export type TestClientOutput = z.infer<typeof testClientSchema>;
