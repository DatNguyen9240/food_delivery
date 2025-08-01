import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotificationService } from './notification-service.service';
import { User } from '@libs/entities/user.entity';
@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('send-otp')
  async sendOtp(
    @Body() body: { otp: string },
    @Req() req: Request & { user?: User },
  ) {
    const user: User | undefined = req.user;
    console.log('[DEBUG] send-otp body:', body, 'user:', user);
    await this.notificationService.sendOtpEmail(user, body.otp);
    return { message: 'OTP email sent', user };
  }
}
