import { oc } from '@orpc/contract';
export const baseOc = oc
  .errors({
    BAD_REQUEST: { message: 'Bad Request', status: 400 },
    UNAUTHORIZED: { message: 'You are Unauthorized', status: 401 },
    FORBIDDEN: { message: 'You are Forbidden', status: 403 },
    NOT_FOUND: { message: 'Not Found', status: 404 },
    CONFLICT: { message: 'Resource conflict', status: 409 },
    INPUT_VALIDATION_FAILED: { message: 'Input validation failed', status: 422 },
    OUTPUT_VALIDATION_FAILED: { message: 'Output validation failed', status: 500 },
    TOO_MANY_REQUESTS: { message: 'Rate limit exceeded please try again later', status: 429 },
    INTERNAL_SERVER_ERROR: { message: 'Internal Server Error', status: 500 },
    CLIENT_CLOSED_REQUEST: { message: 'Client closed the request', status: 499 },
  }) // ← middleware applied to all procedures
