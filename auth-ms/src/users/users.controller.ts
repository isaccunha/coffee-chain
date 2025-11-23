import { Body, Controller, HttpCode, Post, BadRequestException } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { PrismaService } from 'src/prisma';
import { Role, Prisma } from '../../generated/prisma/client';
import { createUserBodySchema } from './@types/createUserBodySchema.type';
import type { CreateUserBodySchemaType } from './@types/createUserBodySchema.type';
import { TokenPayloadType } from 'src/auth/@types';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateUserBodySchemaType) {
    const { name, email, password } = createUserBodySchema.parse(body);

    const hashedPassword = await hash(password, 8);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          // always create users as BUYER
          role: Role.BUYER,
        },
      });

      const userPayload: TokenPayloadType = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    
      const token = this.jwtService.sign(userPayload);
      const { password: _pwd, ...safe } = user as any;

      return {
        ...safe,
        token,
      };
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('Email already in use');
      }

      throw err;
    }
  }
}
