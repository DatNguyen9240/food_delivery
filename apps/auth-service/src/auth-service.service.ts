import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@libs/entities/user.entity';
import { sendOtpKafka } from '@utils/kafka-util';
import { hashPassword, comparePassword } from '@utils/password-util';
import { generateOtp } from '@utils/otp-util';
import { redis } from '@thirdParty/redis-client';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@libs/entities/jwt.strategy'; // Bạn có thể đổi thành jwt-payload.interface.ts

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    user: Omit<User, 'password'> | null;
    accessToken?: string;
    refreshToken?: string;
  }> {
    console.log('[DEBUG] validateUser input:', { email, password });

    const found = await this.usersRepository.findOne({ where: { email } });

    if (
      found &&
      typeof found.password === 'string' &&
      (await comparePassword(password, found.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _ignored, ...result } = found;

      console.log('[DEBUG] validateUser success:', result);

      const payload: JwtPayload = {
        sub: found.id,
        email: found.email,
        username: found.username,
      };

      const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret',
        { expiresIn: '1m' },
      );

      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret',
        { expiresIn: '2m' },
      );

      await redis.connect();
      await redis.set(`refreshToken:${found.email}`, refreshToken, {
        EX: 120,
      });
      await redis.disconnect();

      return { user: result, accessToken, refreshToken };
    }

    console.log('[DEBUG] validateUser failed');
    return { user: null };
  }

  async register(username: string, email: string, password: string) {
    console.log('[DEBUG] register input:', { username, email, password });

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashed = await hashPassword(password);

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashed,
    });

    await this.usersRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _ignored, ...result } = newUser;

    const otp = generateOtp(6);
    await sendOtpKafka(email, otp, result);

    return result;
  }
}
