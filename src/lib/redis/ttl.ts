const ttl = {
  '1m': 60,
  '1h': 60 * 60,
  '1d': 60 * 60 * 24,
  '1w': 60 * 60 * 24 * 7,
  '1y': 60 * 60 * 24 * 365,
};

export default ttl;
export const ogParamsKey = (id: string) => `og:params:${id}`;
