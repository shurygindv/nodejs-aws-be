import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';

import { HttpProxyManager } from '../../services/http-proxy-manager';
import { EnvironmentService } from '../../services/environment-service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [HttpProxyManager, EnvironmentService],
})
export class ProductModule {}
