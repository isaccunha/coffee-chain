import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
