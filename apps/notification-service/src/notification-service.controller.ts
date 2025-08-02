import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotificationService } from './notification-service.service';
import { User } from '@libs/entities/user.entity';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
@ApiTags('Notification Service')
@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiResponse({
    status: 200,
    description: 'OTP email sent successfully',
    type: Object,
  })
  @ApiBody({
    description: 'Send OTP email',
    type: Object,
    examples: {
      example1: {
        summary: 'Example of sending OTP',
        value: { otp: '123456' },
      },
    },
  })
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
