import { type Geo, geoSchema } from '@/server/schemas/geo';

import type { Context } from 'hono';

export type { Geo };
export const GEO_HEADERS = {
  reqId: 'x-request-id',
  ip: 'x-real-ip',
  countryCode: 'x-geoip-country-code',
  country: 'x-geoip-country-name',
  continent: 'x-geoip-continent',
  city: 'x-geoip-city',
  postalCode: 'x-geoip-postal-code',
  regionCode: 'x-geoip-region-code',
  region: 'x-geoip-region-name',
  latitude: 'x-geoip-latitude',
  longitude: 'x-geoip-longitude',
  timezone: 'x-geoip-timezone',
  metroCode: 'x-geoip-metro-code',
} as const;

function countryCodeToFlag(code?: string): string | undefined {
  if (!code || !/^[A-Z]{2}$/.test(code)) {
    return undefined;
  }

  const first = code.charCodeAt(0) + 0x1f1a5;
  const second = code.charCodeAt(1) + 0x1f1a5;

  return String.fromCodePoint(first, second);
}

export const npmplusGeoExtractor = (c: Context): Geo => {
  const raw = {
    reqId: c.req.header(GEO_HEADERS.reqId),
    ip: c.req.header(GEO_HEADERS.ip),
    city: c.req.header(GEO_HEADERS.city),
    country: c.req.header(GEO_HEADERS.country),
    countryCode: c.req.header(GEO_HEADERS.countryCode),
    region: c.req.header(GEO_HEADERS.region),
    regionCode: c.req.header(GEO_HEADERS.regionCode),
    latitude: c.req.header(GEO_HEADERS.latitude),
    longitude: c.req.header(GEO_HEADERS.longitude),
    continent: c.req.header(GEO_HEADERS.continent),
    postalCode: c.req.header(GEO_HEADERS.postalCode),
    metroCode: c.req.header(GEO_HEADERS.metroCode),
    timezone: c.req.header(GEO_HEADERS.timezone),
  };

  const geo = geoSchema.parse(raw); // every field .catch()'s to undefined, so this never throws
  return { ...geo, flag: countryCodeToFlag(geo.countryCode) };
};
