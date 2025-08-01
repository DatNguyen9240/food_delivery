import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { setupSwagger } from '@configs/swagger'; // Import the Swagger setup function

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  setupSwagger(app, 'Order Service', 'API docs for Order Service', '1.0');
  await app.listen(3004);
  console.log('Order Service is running on port 3004');
}
bootstrap();
