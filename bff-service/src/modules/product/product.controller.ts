import { Controller, All, Req, Request, HttpStatus } from '@nestjs/common';

import {
  HttpProxyManager,
  ProxyOptions,
} from '../../services/http-proxy-manager';

@Controller('products')
export class ProductController {
  constructor(private httpProxyManager: HttpProxyManager) {}

  private callProductProxy(o: ProxyOptions): Promise<any> {
    return this.httpProxyManager.callProductService(o);
  }

  @All()
  async proxyAnyRequest(@Req() req: Request) {
    const { method, body, url } = req;

    let data;

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
