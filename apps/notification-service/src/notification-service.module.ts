import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from './notification-service.service';
import { NotificationServiceController } from './notification-service.controller';
import { JwtStrategy } from '../../../libs/jwt/jwt.strategy'; // Import JwtStrategy from the shared library

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret', // Thay bằng secret thực tế
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationService, JwtStrategy],
})
export class NotificationServiceModule {}
