import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { authBodySchema } from './@types';
import type { AuthBodySchemaType } from './@types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthBodySchemaType) {
    const { email, password } = authBodySchema.parse(body);

    const user = await this.authService.signIn({
      email,
      password,
    });

    return {
      ...user,
    };
  }
}
