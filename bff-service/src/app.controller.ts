import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  public getHello() {
    return 'Hello World!';
  }
}
