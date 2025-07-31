import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env ở gốc project
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  await app.listen(3003);
  console.log('Notification service is running on port 3003');
}
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
});
