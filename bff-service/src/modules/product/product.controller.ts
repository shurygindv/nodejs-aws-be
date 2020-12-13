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

  private callProductProxy(o: ProxyOptions): Promise<any> {
    return this.httpProxyManager.callProductService(o);
  }

  private async proxyProductRequest(options: ProxyOptions) {
    let response;

    try {
      const { method, body, url } = options;

      response = await this.callProductProxy({
        url,
        body,
        method
      });
    } catch (e) {
      console.error(e.message);

      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        error: e.message,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      data: response.data,
    };
  }

  @Get('/products')
  @Cache({ ttl: TWO_MINUTES, key: 'products' })
  public getAllCachedProducts(@Req() req: Request) {
    return this.proxyProductRequest({
      url: '/products',
      method: req.method,
    });
  }

  @All()
  public getAnyRequest(@Req() req: Request) {
    return this.proxyProductRequest({
      url: req.url,
      body: req.body,
      method: req.method,
    });
  }
}
