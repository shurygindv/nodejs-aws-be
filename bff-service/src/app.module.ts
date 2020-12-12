import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CardModule } from './modules/card';
import { ProductModule } from './modules/product';

@Module({
  imports: [CardModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
