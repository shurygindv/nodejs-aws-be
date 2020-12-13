import { Controller, All, Req, Request, HttpStatus } from '@nestjs/common';

import {
  HttpProxyManager,
  ProxyOptions,
} from '../../services/http-proxy-manager';

@Controller('carts')
export class CartController {
  constructor(private httpProxyManager: HttpProxyManager) {}

  private callCardProxy(o: ProxyOptions): Promise<any> {
    return this.httpProxyManager.callCardService(o);
  }

  @All()
  async proxyAnyRequest(@Req() req: Request) {
    let response;

    try {
      const { method, body, url } = req;

      response = await this.callCardProxy({
        method,
        url,
        body
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
}
