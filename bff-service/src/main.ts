import { NestFactory } from '@nestjs/core';

import * as helmet from 'helmet';

import { AppModule } from './app.module';

const PORT = process.env.PORT || 7777;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.use(helmet());

  await app.listen(PORT);
};

bootstrap().then(() => {
  console.log(`App is running on ${PORT} port`);
});
