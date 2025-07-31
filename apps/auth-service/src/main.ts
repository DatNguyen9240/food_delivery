import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  setupSwagger(app, 'Auth Service', 'API docs for Auth Service', '1.0');
  await app.listen(3002);
  console.log('Auth service is running on port 3002');
}
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
});
