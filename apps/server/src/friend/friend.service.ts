import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendService {
  getHello(): string {
    return 'hello friend';
  }
}
