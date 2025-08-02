import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { setupSwagger } from '@configs/swagger';
// Load .env ở gốc project
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  setupSwagger(app);
  await app.listen(3003);
  console.log('Notification service is running on port 3003');
}
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
});
