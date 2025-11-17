import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { EnvType } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<EnvType, true> = app.get(ConfigService);
  const serverPort = configService.get('API_PORT', {
    infer: true,
  });
  await app.listen(serverPort);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
