import { Module } from '@nestjs/common';

import { CardController } from './card.controller';

import { HttpProxyManager } from '../../services/http-proxy-manager';
import { EnvironmentService } from '../../services/environment-service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [HttpProxyManager, EnvironmentService],
})
export class CardModule {}
