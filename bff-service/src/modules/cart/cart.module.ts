import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';

import { HttpProxyManager } from '../../services/http-proxy-manager';
import { EnvironmentService } from '../../services/environment-service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [HttpProxyManager, EnvironmentService],
})
export class CartModule {}
