import { neonDb } from '@/lib/drizzle/neon/client.neon.db';
import { pgDb } from '@/lib/drizzle/pg/client.pg.db';
import { sqliteDb } from '@/lib/drizzle/sqlite/client';
import { type EnvServer } from '@/lib/env/server.env';
import { redisVps } from '@/lib/redis/client.redis.vps';
import { producer } from '@/lib/redpanda-kafka/producer';
import { rustfsClient } from '@/lib/s3/client.rustfs.vps';
import type { Geo } from '@/server/schemas/geo';

export type Env = {
  Bindings: EnvServer;
  Variables: {
    sqlite: typeof sqliteDb;
    pg: typeof pgDb;
    neon: typeof neonDb;
    producer: typeof producer;
    rustfs: typeof rustfsClient;
    redis: typeof redisVps;
    geo: Geo;
  };
};
