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

  return axios(proxyRequest);
};

const fetchProxyResultByUrl = (url: string, options: Partial<ProxyOptions>) => {
  return fetchProxyResultAsync({
    ...options,
    url,
  });
};

@Injectable()
export class HttpProxyManager {
  constructor(private envService: EnvironmentService) {}

  public async callCardService(options: ProxyOptions) {
    const cardUrl = this.envService.getCardBaseUrl();
    const url = options.url;

    return await fetchProxyResultByUrl(`${cardUrl}${url}`, options);
  }

  public async callProductService(options: ProxyOptions) {
    const productUrl = this.envService.getProductBaseUrl();
    const url = options.url;

    return await fetchProxyResultByUrl(`${productUrl}${url}`, options);
  }
}
