import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  public getProductBaseUrl(): string {
    return process.env.product;
  }

  public getCardBaseUrl(): string {
    return process.env.cart;
  }
}
