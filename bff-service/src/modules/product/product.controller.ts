import { Controller, All, Req, Get, Request, HttpStatus } from '@nestjs/common';

import {
  HttpProxyManager,
  ProxyOptions,
} from '../../services/http-proxy-manager';

import { Cache } from '../../decorators/cache.decorator';

const ONE_MINUTE = 1000 * 60;
const TWO_MINUTES = ONE_MINUTE * 2;

@Controller('products')
export class ProductController {
  constructor(private httpProxyManager: HttpProxyManager) {}

  @Cache({ ttl: TWO_MINUTES, key: 'products' })
  @Get('/products')
  async getAllCachedProducts(@Req() req: Request) {
    return this.proxyAnyRequest(req);
  }

  private callProductProxy(o: ProxyOptions): Promise<any> {
    return this.httpProxyManager.callProductService(o);
  }

  @All()
  async proxyAnyRequest(@Req() req: Request) {
    const { method, body, url } = req;

    try {
      data = await this.callProductProxy({
        url,
        method,
        body,
      });
    } catch (e) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        error: e.message,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
