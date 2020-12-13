import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CartModule } from './modules/cart';
import { ProductModule } from './modules/product';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
