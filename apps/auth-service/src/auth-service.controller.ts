import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth-service.service';

@ApiTags('auth')
@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() body: { email: string; password: string }) {
    console.log('[DEBUG] login controller input:', body);
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      console.log('[DEBUG] login controller: Invalid credentials');
      return { message: 'Invalid credentials' };
    }
    // Tạo token JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(user, 'your-secret', { expiresIn: '1h' }); // Thay 'your-secret' bằng secret thực tế
    console.log('[DEBUG] login controller: Login successful', user);
    return { message: 'Login successful', user, token };
  }

  @Post('register')
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Register successful' })
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    console.log('[DEBUG] register controller input:', body);
    try {
      const user = await this.authService.register(
        body.username,
        body.email,
        body.password,
      );
      console.log('[DEBUG] register controller: Register successful', user);
      return { message: 'Register successful', user };
    } catch (e) {
      console.log('[DEBUG] register controller: Error', e);
      return { message: e.message };
    }
  }
}
