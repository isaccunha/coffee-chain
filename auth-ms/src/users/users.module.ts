import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
