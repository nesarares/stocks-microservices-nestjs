export const config = {
  wsPort: parseInt(process.env.WS_PORT) || 8079,
  apiPort: parseInt(process.env.PORT) || 8080,

  authHost: process.env.AUTH_HOST || '127.0.0.1',
  authPort: parseInt(process.env.AUTH_PORT) || 8081,

  stocksHost: process.env.STOCKS_HOST || '127.0.0.1',
  stocksPort: parseInt(process.env.STOCKS_PORT) || 8082,

  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: parseInt(process.env.REDIS_PORT) || 6379,
};
