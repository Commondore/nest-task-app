import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello world',
      status: 'ok',
    };
  }

  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
    };
  }
}
