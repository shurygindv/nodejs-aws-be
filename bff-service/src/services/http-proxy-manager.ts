import { Injectable, HttpService } from '@nestjs/common';
import { EnvironmentService } from './environment-service';

export type ProxyOptions<T = any> = {
  method: string;
  url: string;
  body?: T;
};

const isEmpty = <T>(obj: T) => {
  return Object.keys(obj || {}).length <= 0;
};

@Injectable()
export class HttpProxyManager {
  constructor(
    private envService: EnvironmentService,
    private httpService: HttpService,
  ) {}

  private fetchProxyResultAsync(params: any) {
    const data = isEmpty(params.body) ? undefined : params.body;

    const proxyRequest = {
      url: params.url,
      data: data,
      method: params.method,
    };

    return this.httpService.request(proxyRequest).toPromise();
  }

  private fetchProxyResultByUrl(url: string, options: Partial<ProxyOptions>) {
    console.log(`request: ${url}`);

    return this.fetchProxyResultAsync({
      ...options,
      url: `${url}${options.url}`,
    });
  }

  public callCardService(options: ProxyOptions) {
    const cardUrl = this.envService.getCardBaseUrl();

    return this.fetchProxyResultByUrl(cardUrl, options);
  }

  public callProductService(options: ProxyOptions) {
    const productUrl = this.envService.getProductBaseUrl();

    return this.fetchProxyResultByUrl(productUrl, options);
  }
}
