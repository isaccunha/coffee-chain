import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users';
import { JwtStrategy } from './jwt.strategy';
import { EnvType } from 'src/env';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(configService: ConfigService<EnvType, true>) {
        const privateKey = configService.get('JWT_PRIVATE_KEY', {
          infer: true,
        });
        const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true });
        return {
          signOptions: { algorithm: 'RS256', expiresIn: '1d' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        };
      },
    }),
  ],
})
export class AuthModule {}
