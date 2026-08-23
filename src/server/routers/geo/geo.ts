import { base } from '@/server/procedures/base';

export const geoRoute = base.geo.geoContract.handler(async ({ context, errors }) => {
  const isProd = context.env?.PRODUCTION === 'true';

  if (!isProd) {
    return {
      reqId: 'abc123',
      ip: '127.0.0.1',
      city: 'San Francisco',
      country: 'US',
      countryCode: 'US',
      region: 'CA',
      regionCode: 'CA',
      latitude: 37.7749,
      longitude: -122.4194,
      continent: 'North America',
      postalCode: '94102',
      metroCode: '415',
      timezone: 'America/Los_Angeles',
      flag: '🇺🇸',
    };
  }

  // In prod, "unavailable" means no country code came through — the one field
  // that should always be present if nginx's geoip2 headers reached us at all
  if (!context.geo?.countryCode) {
    throw errors.INTERNAL_SERVER_ERROR({ message: 'Geo data unavailable' });
  }

  return context.geo;
});
