import { Controller, All, Req, Request, HttpStatus } from '@nestjs/common';

import {
  HttpProxyManager,
  ProxyOptions,
} from '../../services/http-proxy-manager';

@Controller('cards')
export class CardController {
  constructor(private httpProxyManager: HttpProxyManager) {}

  private callCardProxy(o: ProxyOptions): Promise<any> {
    return this.httpProxyManager.callCardService(o);
  }

  @All()
  async proxyAnyRequest(@Req() req: Request) {
    const { method, body, url } = req;

    let data;

    try {
      data = await this.callCardProxy({
        method,
        url,
        body,
      });
    } catch (e) {
      console.error(e.message);

      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        error: e.message,
      };
    }

    console.info(data);

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
