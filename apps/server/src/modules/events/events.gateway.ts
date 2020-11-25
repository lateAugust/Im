import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import WebSocket, { Server } from 'ws';
import { EventsMessageDto } from '../../dto/events/events.dto';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';

import { sortReturnString } from 'apps/server/src/utils/utils';

interface UserOnline {
  [key: number]: WebSocket;
}

function transferToString(data: any): string {
  return JSON.stringify(data);
}

function transferToObject<T>(data: string): T {
  return JSON.parse(data);
}

// 遗留问题, 数据需要校验, 但是不好测试, 等后面测试时候再添加
// 就先这样, 可以开始去写前端了
@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  userOnline: UserOnline = {};

  constructor(
    @InjectRepository(Links) private readonly linksRepository: Repository<Links>,
    @InjectRepository(Messages) private readonly messafessRepository: Repository<Messages>
  ) {}

  @SubscribeMessage('message')
  onEvent(client: WebSocket, data: EventsMessageDto): Observable<WsResponse<number>> {
    console.log(data);
    let userId = Number(data.send_id);
    this.userOnline[userId] = client;
    this.close(userId);
    this.message(userId);
    // this.linksRepository.save({ message: '88888' });
    return from([1]).pipe(map(item => ({ event: 'message', data: item })));
  }
  handleConnection(client) {
    // console.log(client);
    // 初始化连接
  }

  handleDisconnect(client: WebSocket) {
    console.log(client);
    // 断开
  }
  message(userId: number) {
    this.userOnline[userId].on('message', (data: string) => {
      // 接收到消息, 先保存到数据库后发给客户端
      this.saveMessage(transferToObject<EventsMessageDto>(data));
    });
  }
  returnMessage(userId: number, data: EventsMessageDto) {
    this.userOnline[userId].send(transferToString(data));
  }
  send(receiveId: number, data: EventsMessageDto) {
    // 给某人发送消息
    this.userOnline[receiveId] && this.userOnline[receiveId].send(transferToString(data));
  }
  async saveMessage({ send_user, send_id, receive_id, receive_user, message, links_id, message_id }: EventsMessageDto) {
    let linksData = {
      receive_user,
      send_user,
      message,
      unread_count: 1,
      ids: sortReturnString(send_id, receive_id),
      send_id,
      receive_id
    };

    let messagesData = {
      message,
      receive_id,
      send_id
    };
    // 这里往下 还有links_id 和message_id需要修改下, 等后面测试的时候看下保存/修改的返回值, 修改下id
    if (links_id) {
      await this.linksRepository.query(
        `UPDATE links SET message=${message},unread_count=IF(unread_count = 0, 1, unread_count+1) WHERE id=${links_id}`
      );
    } else {
      await this.linksRepository.save(linksData);
    }

    let result = await this.messafessRepository.save(messagesData);
    this.send(receive_id, {
      message,
      send_id: receive_id,
      receive_id: send_id,
      receive_user: send_user,
      send_user: receive_user,
      links_id,
      message_id
    });
    this.returnMessage(send_id, { message, send_user, receive_id, receive_user, send_id, links_id, message_id });
  }
  close(userId: number) {
    this.userOnline[userId].on('close', () => {
      Reflect.deleteProperty(this.userOnline, userId);
    });
  }
}
