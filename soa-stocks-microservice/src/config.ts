export const config = {
  finnhubKey: 'sandbox_bvh6psf48v6p4qlb8sc0',

  stocksHost: process.env.STOCKS_HOST || '127.0.0.1',
  stocksPort: (process.env.STOCKS_PORT || 8082) as number,
};
