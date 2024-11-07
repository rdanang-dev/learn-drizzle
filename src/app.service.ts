import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'If you seen this, then the app working fine!';
  }
}
