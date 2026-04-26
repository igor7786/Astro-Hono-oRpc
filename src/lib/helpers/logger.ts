import { logger } from 'hono/logger';

const color = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

export const prettyLogger = logger((str) => {
  // <-- incoming request
  if (str.startsWith('<--')) {
    const [, method, ...pathParts] = str.split(' ');
    const path = pathParts.join(' ');

    console.log(`${color.cyan}<--${color.reset} ${color.green}${method}${color.reset} ${path}`);
    return;
  }

  // --> outgoing response
  if (str.startsWith('-->')) {
    const [, method, ...rest] = str.split(' ');

    const status = rest[rest.length - 2];
    const time = rest[rest.length - 1];
    const path = rest.slice(0, -2).join(' ');

    const statusCode = Number(status);

    const statusColor = statusCode >= 500 ? color.red : statusCode >= 400 ? color.yellow : color.green;

    console.log(
      `${color.blue}-->${color.reset} ` +
        `${color.green}${method}${color.reset} ` +
        `${path} ` +
        `${statusColor}${status}${color.reset} ` +
        `${color.gray}${time}${color.reset}`
    );

    return;
  }

  // fallback (just in case)
  console.log(str);
});
