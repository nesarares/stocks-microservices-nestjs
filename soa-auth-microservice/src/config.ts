export const config = {
  authHost: process.env.AUTH_HOST || '127.0.0.1',
  authPort: (process.env.AUTH_PORT || 8081) as number,
};
