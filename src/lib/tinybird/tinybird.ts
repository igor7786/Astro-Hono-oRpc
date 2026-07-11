/**
 * Tinybird Definitions
 *
 * Define your datasources, endpoints, and client here.
 * No Kafka connection needed — Tinybird can't present a client
 * certificate for mTLS, so data arrives via the Events API instead,
 * pushed by src/lib/redpanda-to-tinybird.ts
 */
import {
  defineDatasource,
  defineEndpoint,
  engine,
  type InferOutputRow,
  type InferParams,
  type InferRow,
  node,
  p,
  t,
  Tinybird,
} from '@tinybirdco/sdk';

// ============================================================================
// Datasources
// ============================================================================

/**
 * Test datasource - receives messages bridged from the Redpanda "test" topic
 */
export const test = defineDatasource('test', {
  description: 'Test topic bridged from Redpanda via Events API',
  schema: {
    timestamp: t.dateTime(),
    payload: t.string(),
  },
  engine: engine.mergeTree({
    sortingKey: ['timestamp'],
  }),
});

export type TestRow = InferRow<typeof test>;

// ============================================================================
// Endpoints
// ============================================================================

/**
 * Recent test events endpoint
 */
export const recentTestEvents = defineEndpoint('recent_test_events', {
  description: 'Get recent test events',
  params: {
    start_date: p.dateTime().optional('2020-01-01 00:00:00').describe('Start of date range'),
    end_date: p.dateTime().optional('2030-01-01 00:00:00').describe('End of date range'),
    limit: p.int32().optional(50).describe('Number of results'),
  },
  nodes: [
    node({
      name: 'recent',
      sql: `
        SELECT timestamp, payload
        FROM test
        WHERE timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
        ORDER BY timestamp DESC
        LIMIT {{Int32(limit, 50)}}
      `,
    }),
  ],
  output: {
    timestamp: t.dateTime(),
    payload: t.string(),
  },
});

export type RecentTestEventsParams = InferParams<typeof recentTestEvents>;
export type RecentTestEventsOutput = InferOutputRow<typeof recentTestEvents>;

// ============================================================================
// Client
// ============================================================================

export const tinybird = new Tinybird({
  datasources: { test },
  pipes: { recentTestEvents },
});

export type TinybirdClient = typeof tinybird;
