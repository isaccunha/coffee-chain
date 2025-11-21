import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { authBodySchema } from './@types';
import { ConfigService } from '@nestjs/config';

import type {
  AuthBodySchemaType,
  AuthRequest,
  TokenPayloadType,
} from './@types';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  async login(@Body() body: AuthBodySchemaType) {
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

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  checkToken(@Request() req: AuthRequest) {
    const userPayload = req.user;

    return {
      ...userPayload,
    };
  }

  @Get('public-key')
  @HttpCode(200)
  getPublicKey() {
    const publicKeyBase64 = this.configService.get<string>('JWT_PUBLIC_KEY', {
      infer: true,
    });

    return {
      alg: 'RS256',
      publicKey: publicKeyBase64, 
    };
  }
}
