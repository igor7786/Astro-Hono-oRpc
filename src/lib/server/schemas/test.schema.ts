import { z } from 'zod';
export const testSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(40, { message: 'Name must be at most 40 characters long' })
    .default('John Doe'),
});
