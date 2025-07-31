import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { dbConfig } from '../../../configs/config';
import { User } from '../../../types/user.entity';
import { AuthService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { JwtStrategy } from '../../../libs/jwt/jwt.strategy'; // Import JwtStrategy from the shared library
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret', // Thay bằng secret thực tế
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthServiceController],
})
export class AuthServiceModule {}
