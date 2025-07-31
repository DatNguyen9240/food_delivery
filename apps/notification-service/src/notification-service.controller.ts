import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotificationService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('send-otp')
  async sendOtp(@Body() body: { otp: string }, @Req() req: Request) {
    const user = (req as any).user;
    const email = user?.email;
    console.log('[DEBUG] send-otp body:', body, 'user:', user);
    await this.notificationService.sendOtpEmail(email, body.otp, user);
    return { message: 'OTP email sent', user };
  }
}
