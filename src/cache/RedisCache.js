const redis = require('redis');
const genericPool = require('generic-pool');
const { promisify } = require('util');

module.exports = class RedisCache {
  constructor() {
    if (RedisCache.instance) return RedisCache.instance;
    const redisFactory = {
      create: () => {
        return new Promise((resolve, reject) => {
          const client = redis.createClient({
            url: process.env.REDISCLOUD_URL,
            connectTimeout: 3000,
          });
          client.on('error', (err) => reject(err));
          client.on('connect', () => resolve(client));
        });
      },
      destroy: (client) => {
        return new Promise((resolve) => {
          client.end(true);
          resolve();
        });
      },
    };
    this.pool = genericPool.createPool(redisFactory, {
      max: process.env.REDIS_POOL_MAX || 5,
      min: process.env.REDIS_POOL_MIN || 2,
    });
    RedisCache.instance = this;
  }

  async getClient() {
    const client = await this.pool.acquire();
    client.getAsync = promisify(client.get).bind(client);
    client.setAsync = promisify(client.set).bind(client);
    client.delAsync = promisify(client.del).bind(client);
    client.keysAsync = promisify(client.keys).bind(client);
    return client;
  }

  async releaseClient(client) {
    await this.pool.release(client);
  }

  async get(key) {
    const client = await this.getClient();
    try {
      const data = await client.getAsync(key);
      return JSON.parse(data);
    } catch (error) {
      console.error('Redis get error:', error);
      throw error;
    } finally {
      await this.releaseClient(client);
    }
  }

  async set(key, value, ttl = 600) {
    const client = await this.getClient();
    try {
      const stringValue = JSON.stringify(value);
      await client.setAsync(key, stringValue, 'EX', ttl);
    } catch (error) {
      console.error('Redis set error:', error);
      throw error;
    } finally {
      await this.releaseClient(client);
    }
  }

  async deleteAll(keySearch) {
    const client = await this.getClient();
    try {
      const keyList = await client.keysAsync(keySearch);
      for (const key of keyList) await client.delAsync(key);
    } catch (error) {
      console.error('Redis deleteMany error:', error);
      throw error;
    }
  }

  async delete(key) {
    const client = await this.getClient();
    try {
      await client.delAsync(key);
    } catch (error) {
      console.error('Redis delete error:', error);
      throw error;
    } finally {
      await this.releaseClient(client);
    }
  }
};
