import {
  Injectable,
  NestMiddleware,
  BadGatewayException,
} from '@nestjs/common';

// TODO: Enum constants
const canEnterRequest = (name: string) => name &&
  ['carts', 'products'].includes(name);

@Injectable()
export class RejectInvalidProxyMiddleware implements NestMiddleware  {
  use(req: any, _res, next: Function) {
    const [, proxyName] = (req.originalUrl || '').split('/');

    if (!canEnterRequest(proxyName)) {
      throw new BadGatewayException('Cannot process request!');
    }

    next();
  }
}
