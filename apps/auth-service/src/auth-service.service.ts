import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../types/user.entity';
import { sendOtpKafka } from '../../../utils/kafka-util';

import { hashPassword, comparePassword } from '../../../utils/password-util';
import { generateOtp } from '../../../utils/otp-util';
import { redis } from '../../../thirst_partys/redis-client'; // Import Redis client

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
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('[DEBUG] validateUser found user:', user);
    if (user && (await comparePassword(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      console.log('[DEBUG] validateUser success:', result);
      const jwt = require('jsonwebtoken');
      const accessToken = jwt.sign(
        result,
        process.env.JWT_SECRET || 'your-secret',
        { expiresIn: '1m' },
      );
      const refreshToken = jwt.sign(
        result,
        process.env.JWT_SECRET || 'your-secret',
        { expiresIn: '2m' },
      );
      // Lưu refreshToken vào Redis với key là email
      await redis.connect();
      await redis.set(`refreshToken:${result.email}`, refreshToken, {
        EX: 120, // 2 phút
      });
      await redis.disconnect();
      return { user: result, accessToken, refreshToken };
    }
    console.log('[DEBUG] validateUser failed');
    return { user: null };
  }

  async register(username: string, email: string, password: string) {
    console.log('[DEBUG] register input:', { username, email, password });
    if (
      await this.usersRepository.findOne({ where: [{ username }, { email }] })
    ) {
      throw new Error('Username or email already exists');
    }
    const hashed = await hashPassword(password);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashed,
    });
    await this.usersRepository.save(user);
    const { password: _, ...result } = user;

    // Gửi OTP qua Kafka
    const otp = generateOtp(6);
    await sendOtpKafka(email, otp, result);

    return result;
  }
}
