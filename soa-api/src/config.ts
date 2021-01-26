export const config = {
  apiPort: process.env.PORT || 8080,

  authHost: process.env.AUTH_HOST || '127.0.0.1',
  authPort: parseInt(process.env.AUTH_PORT) || 8081,

  stocksHost: process.env.STOCKS_HOST || '127.0.0.1',
  stocksPort: parseInt(process.env.STOCKS_PORT) || 8082,
};
