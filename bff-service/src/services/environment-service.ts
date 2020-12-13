import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  public getProductBaseUrl(): string {
    return 'https://0zd9g6b1yf.execute-api.eu-west-1.amazonaws.com/dev';
  }

  public getCardBaseUrl(): string {
    return process.env.cart;
  }
}
