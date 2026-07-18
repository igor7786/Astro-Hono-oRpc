import { Producer, stringSerializers } from '@platformatic/kafka';

import { baseConfig } from '@/lib/redpanda-kafka/config.redpanda.vps';

type OgCacheEventValue = {
  tier: 'redis' | 'rustfs' | 'miss';
  key: string;
  format: string;
  title?: string;
  timestamp: string;
};

const getOgImageProducer = async () => {
  const config = baseConfig;

  const producer = new Producer({
    ...config,
    serializers: stringSerializers,
  });
  return producer;
};
const producer = await getOgImageProducer();
export { producer, type OgCacheEventValue };
