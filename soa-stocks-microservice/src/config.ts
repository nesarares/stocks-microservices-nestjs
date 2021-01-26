export const config = {
  stocksHost: process.env.STOCKS_HOST || '127.0.0.1',
  stocksPort: parseInt(process.env.STOCKS_PORT) || 8082,
};
