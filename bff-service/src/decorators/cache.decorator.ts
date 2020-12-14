import * as LRU from 'lru-cache';

const cache = new LRU();

type CacheOptions = {
  ttl: number;
  key: string;
};

export const Cache = (options: CacheOptions) => {
  const { key, ttl } = options;

  return function (_t, _prop, descriptor: PropertyDescriptor) {
    const prevMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const existingCache = cache.get(key);

      if (existingCache) {
        return existingCache;
      }

      const result = await prevMethod.apply(this, args);

      cache.set(key, result, ttl);

      return result;
    };
  };
};
