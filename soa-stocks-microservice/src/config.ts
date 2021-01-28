export const config = {
  stocksHost: process.env.STOCKS_HOST || '127.0.0.1',
  stocksPort: parseInt(process.env.STOCKS_PORT) || 8082,
  
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: parseInt(process.env.REDIS_PORT) || 6379,
};
