import { compare } from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { FindUserByCredentials } from './@types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByCredentials({ email, password }: FindUserByCredentials) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('User credentials do not match.');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new NotFoundException('User credentials do not match.');

    return user;
  }
}
