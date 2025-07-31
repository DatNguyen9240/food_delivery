import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { proxyRoutes } from './proxy/proxy.routes';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Thêm middleware rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100, // tối đa 100 request mỗi IP mỗi windowMs
      message: 'Too many requests, please try again later.',
    }),
  );

  // Đăng ký tất cả proxy route từ cấu hình
  for (const { route, middleware } of proxyRoutes) {
    app.use(route, middleware);
  }

  await app.listen(3000);
  console.log('API Gateway is running on port 3000');
}
bootstrap();
