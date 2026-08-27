import { z } from 'zod';

// Expanded with common HTTP, application, and mTLS error codes
export const ErrorCodeSchema = z.enum([
  '400', // Bad Request
  '401', // Unauthorized
  '403', // Forbidden / Restricted
  '404', // Not Found
  '405', // Method Not Allowed
  '408', // Request Timeout
  '429', // Too Many Requests
  '495', // mTLS Certificate Error
  '496', // mTLS Certificate Missing
  '500', // Internal Server Error
  '502', // Bad Gateway
  '503', // Service Unavailable
  '504', // Gateway Timeout
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const errorContent: Record<ErrorCode, { title: string; message: string }> = {
  '400': {
    title: 'Bad Request',
    message: 'The server could not understand the request due to invalid syntax.',
  },
  '401': {
    title: 'Unauthorized',
    message: 'You need to sign in to view this page.',
  },
  '403': {
    title: 'Access Restricted',
    message: "Access to this site isn't available from your region.",
  },
  '404': {
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist.",
  },
  '405': {
    title: 'Method Not Allowed',
    message: "That request method isn't supported here.",
  },
  '408': {
    title: 'Request Timeout',
    message: 'The server timed out waiting for the request to complete.',
  },
  '429': {
    title: 'Too Many Requests',
    message: "You've made too many requests recently. Please slow down and try again.",
  },
  '495': {
    title: 'Security Certificate Invalid',
    message: 'The client TLS certificate provided is invalid, expired, or untrusted.',
  },
  '496': {
    title: 'Security Certificate Required',
    message: 'This service requires a valid client mTLS certificate to grant access.',
  },
  '500': {
    title: 'Something Went Wrong',
    message: "We're experiencing an issue. Please try again shortly.",
  },
  '502': {
    title: 'Bad Gateway',
    message: 'The server received an invalid response from an upstream server.',
  },
  '503': {
    title: 'Service Unavailable',
    message: 'The server is temporarily overloaded or down for maintenance.',
  },
  '504': {
    title: 'Gateway Timeout',
    message: 'The upstream server failed to respond within the allowed time limit.',
  },
};

export type ErrorContent = typeof errorContent;

export const errorCardSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  requestId: z.string(),
  isServerError: z.boolean(),
});

export type ErrorCardProps = z.infer<typeof errorCardSchema>;
