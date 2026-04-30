import { oc } from '@orpc/contract';

export const baseOc = oc.errors({
  BAD_REQUEST: {
    message: 'Bad Request',
    status: 400,
    description: 'The request is invalid or malformed',
    code: 'BAD_REQUEST',
  },
  UNAUTHORIZED: {
    message: 'You are Unauthorized',
    status: 401,
    description: 'Authentication is required or has failed',
    code: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    message: 'You are Forbidden',
    status: 403,
    description: 'You do not have permission to access this resource',
    code: 'FORBIDDEN',
  },
  NOT_FOUND: {
    message: 'Not Found',
    status: 404,
    description: 'The requested resource does not exist',
    code: 'NOT_FOUND',
  },
  CONFLICT: {
    message: 'Resource conflict',
    status: 409,
    description: 'The request conflicts with current state of the resource',
    code: 'CONFLICT',
  },
  INPUT_VALIDATION_FAILED: {
    message: 'Input validation failed',
    status: 422,
    description: 'Request input did not pass validation',
    code: 'INPUT_VALIDATION_FAILED',
  },
  OUTPUT_VALIDATION_FAILED: {
    message: 'Output validation failed',
    status: 500,
    description: 'Server returned invalid response format',
    code: 'OUTPUT_VALIDATION_FAILED',
  },
  TOO_MANY_REQUESTS: {
    message: 'Rate limit exceeded please try again later',
    status: 429,
    description: 'Too many requests in a short period',
    code: 'TOO_MANY_REQUESTS',
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    status: 500,
    description: 'Unexpected server error',
    code: 'INTERNAL_SERVER_ERROR',
  },
  CLIENT_CLOSED_REQUEST: {
    message: 'Client closed the request',
    status: 499,
    description: 'Client terminated the request early',
    code: 'CLIENT_CLOSED_REQUEST',
  },
}); // ← middleware applied to all procedures
