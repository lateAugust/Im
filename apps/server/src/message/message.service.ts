import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  getHello(): string {
    return 'hello message';
  }
}
