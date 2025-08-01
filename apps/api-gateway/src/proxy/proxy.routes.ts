import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from '../middleware/auth.middleware';

export const proxyRoutes = [
  {
    route: '/auth',
    middleware: createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
    }),
  },
  {
    route: '/notifications',
    middleware: [
      authMiddleware,
      createProxyMiddleware({
        target: 'http://localhost:3003',
        changeOrigin: true,
      }),
    ],
  },
  {
    route: '/orders',
    middleware: [
      authMiddleware,
      createProxyMiddleware({
        target: 'http://localhost:3004',
        changeOrigin: true,
      }),
    ],
  },
];
