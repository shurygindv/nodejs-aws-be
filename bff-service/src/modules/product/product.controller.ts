import {
  Controller,
  All,
  Req,
  Request,
  HttpStatus,
  Get 
  /* CacheInterceptor */,
} from '@nestjs/common';

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
        method,
      });
    } catch (e) {
      console.error(`proxy card error: ${JSON.stringify(e)}`);

      const {
        status = HttpStatus.INTERNAL_SERVER_ERROR,
        data = { error: e.message },
      } = e.response || {};

      return {
        status,
        message: e.message,
        data,
      };
    }

    return {
      status: HttpStatus.OK,
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
  public catchAnyRequest(@Req() req: Request) {
    return this.proxyProductRequest({
      url: req.url,
      body: req.body,
      method: req.method,
    });
  }
}
