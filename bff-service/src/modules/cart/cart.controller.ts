import {
  Controller,
  All,
  Req,
  Request,
  HttpStatus
  /* CacheInterceptor */,
} from '@nestjs/common';

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
  async catchAnyRequest(@Req() req: Request) {
    let response;

    try {
      const { method, body, url } = req;

      response = await this.callCardProxy({
        method,
        url,
        body,
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
}
