import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { proxyRoutes } from './proxy/proxy.routes';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Đăng ký tất cả proxy route từ cấu hình
  for (const { route, middleware } of proxyRoutes) {
    app.use(route, middleware);
  }

  await app.listen(3000);
  console.log('API Gateway is running on port 3000');
}
bootstrap();
