import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL ,
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis client connected');
});

redis.on('ready', () => {
  console.log('🚀 Redis client ready to use');
});



await redis.connect(); // Top-level await is valid in ESM

export default redis;
