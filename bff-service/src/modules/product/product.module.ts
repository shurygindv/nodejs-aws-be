import { Module, HttpModule } from '@nestjs/common';

import { ProductController } from './product.controller';

import { HttpProxyManager } from '../../services/http-proxy-manager';
import { EnvironmentService } from '../../services/environment-service';

@Module({
  imports: [HttpModule],
  controllers: [ProductController],
  providers: [HttpProxyManager, EnvironmentService],
})
export class ProductModule {}
