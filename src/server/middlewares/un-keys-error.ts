import { ORPCError, ValidationError } from '@orpc/server';
import { os } from '@orpc/server';
import { z } from 'zod';

export const isUnKeysErrors = os.middleware(async ({ context, next }) => {
  try {
    return await next({ context });
  } catch (error) {
    if (
      error instanceof ORPCError &&
      error.code === 'BAD_REQUEST' &&
      error.cause instanceof ValidationError
    ) {
      const issues = error.cause.issues as z.core.$ZodIssue[];

      issues.forEach((issue) => {
        if (issue.code === 'unrecognized_keys') {
          const formattedKeys = issue.keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
          // ✅ TypeScript now knows issue has .keys
          throw new ORPCError('UNRECOGNIZED_KEYS', {
            status: 422,
            message: `${formattedKeys} is not a valid input key`,
            data: { unrecognizedKeys: issue.keys },
            cause: error.cause,
          });
        }
      });
    }

    throw error;
  }
});
