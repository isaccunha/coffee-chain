import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { authBodySchema } from './@types';
import type { AuthBodySchemaType, TokenPayloadType } from './@types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AuthBodySchemaType) {
    const { email, password } = authBodySchema.parse(body);

    const user = await this.authService.signIn({
      email,
      password,
    });

    const userPayload: TokenPayloadType = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);
    return { token };
  }
}
