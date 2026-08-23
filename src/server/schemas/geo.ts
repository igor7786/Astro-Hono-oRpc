import { z } from 'zod';

const ipSchema = z.union([z.ipv4(), z.ipv6()]);

export const geoSchema = z.object({
  reqId: z.string().optional().catch(undefined),

  ip: ipSchema.optional().catch(undefined),

  city: z.string().optional().catch(undefined),

  country: z.string().optional().catch(undefined),

  countryCode: z
    .string()
    .trim()
    .length(2)
    .transform((value) => value.toUpperCase())
    .optional()
    .catch(undefined),

  region: z.string().optional().catch(undefined),

  regionCode: z.string().optional().catch(undefined),

  latitude: z.coerce.number().min(-90).max(90).optional().catch(undefined),

  longitude: z.coerce.number().min(-180).max(180).optional().catch(undefined),

  continent: z.string().optional().catch(undefined),

  postalCode: z.string().optional().catch(undefined),

  metroCode: z.string().optional().catch(undefined),

  timezone: z.string().optional().catch(undefined),

  flag: z.string().optional(),
});

export type Geo = z.infer<typeof geoSchema>;
