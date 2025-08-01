import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../entities/jwt.strategy'; // đường dẫn phù hợp với project bạn

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // không còn lỗi
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret',
    });
  }

  // Trả về kiểu cụ thể, tránh `any`
  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
