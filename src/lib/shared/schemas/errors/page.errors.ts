import { z } from 'zod';

export const ErrorCodeSchema = z.enum(['401', '403', '404', '405', '500']);
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export const errorContent: Record<ErrorCode, { title: string; message: string }> = {
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
  '500': {
    title: 'Something Went Wrong',
    message: "We're experiencing an issue. Please try again shortly.",
  },
};

export type ErrorContent = typeof errorContent;
