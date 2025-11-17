import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users';
import { SignInParams } from './@types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn({ email, password }: SignInParams) {
    try {
      const user = await this.usersService.findUserByCredentials({
        email,
        password,
      });

      return user;
    } catch {
      throw new UnauthorizedException('User credentials do not match.');
    }
  }
}
