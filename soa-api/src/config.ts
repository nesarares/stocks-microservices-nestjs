export const config = {
  apiPort: process.env.PORT || 8080,

  authHost: process.env.AUTH_HOST || '127.0.0.1',
  authPort: parseInt(process.env.AUTH_PORT) || 8081,
};
