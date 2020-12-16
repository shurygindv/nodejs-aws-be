import {
  Injectable,
  NestMiddleware,
  BadGatewayException,
} from '@nestjs/common';

// TODO: Enum constants, guard
const canRequestEnter = (name: string) =>
  name && ['carts', 'products'].includes(name);

const URI_REGEX = /^\/([a-zA-Z]+)/;

@Injectable()
export class RejectInvalidProxyMiddleware implements NestMiddleware {
  use(req: any, _res, next: Function) {
    const [, proxyName] = (req.originalUrl || '').match(URI_REGEX);

    if (!canRequestEnter(proxyName)) {
      throw new BadGatewayException('Cannot process request!');
    }

    next();
  }
}
