import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { EnvironmentService } from './environment-service';

export type ProxyOptions<T = any> = {
  method: string;
  url: string;
  body?: T;
};

const fetchProxyResultAsync = (params: any) => {

  const proxyRequest = {
    url: params.url,
    data: params.body,
    method: params.method,
  };

  console.log(proxyRequest)
  return axios(proxyRequest);
};

const fetchProxyResultByUrl = (url: string, options: Partial<ProxyOptions>) => {
  console.log(`request: ${url}`);

  return fetchProxyResultAsync({
    ...options,
    url,
  });
};

@Injectable()
export class HttpProxyManager {
  constructor(private envService: EnvironmentService) {}

  public callCardService(options: ProxyOptions) {
    const cardUrl = this.envService.getCardBaseUrl();
    const url = options.url;

    return fetchProxyResultByUrl(`${cardUrl}${url}`, options);
  }

  public callProductService(options: ProxyOptions) {
    const productUrl = this.envService.getProductBaseUrl();
    const url = options.url;

    return fetchProxyResultByUrl(`${productUrl}${url}`, options);
  }
}
