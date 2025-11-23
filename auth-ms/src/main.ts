import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { EnvType } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://frontend:3000', 'http://localhost:80'],
    credentials: true,
  });
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
