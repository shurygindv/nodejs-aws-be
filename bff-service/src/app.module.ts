import { Module, MiddlewareConsumer } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// modules
import { CartModule } from './modules/cart';
import { ProductModule } from './modules/product';

// middleware
import { RejectInvalidProxyMiddleware } from './middlewares/reject-invalid-proxy';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(RejectInvalidProxyMiddleware).forRoutes('*');
  }
}
