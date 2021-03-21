import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import WebSocket, { Server } from 'ws';
import { MessageDto } from '../../dto/events/events.dto';
import { Links } from '../../emtites/message/links.emtity';
import { Messages } from '../../emtites/message/messages.emtity';

import { AuthService } from 'libs/auth';
import { sortReturnString, transferToString, wherePublicId } from '../../utils/utils';
import { UsersOnline } from '../../common/interface/events/events.interface';
import { messageTypeEnum } from '../../common/enum/messages';

// 遗留问题, 数据需要校验, 但是不好测试, 等后面测试时候再添加
// 就先这样, 可以开始去写前端了

// 20210128 23:53 完成以上问题
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  usersOnline: UsersOnline = {};

  constructor(
    @InjectRepository(Links) private readonly linksRepository: Repository<Links>,
    @InjectRepository(Messages) private readonly messafessRepository: Repository<Messages>,
    private readonly authService: AuthService
  ) {}

  // 收到消息
  @SubscribeMessage('message')
  async onEvent(client: WebSocket, data: MessageDto): Promise<void> {
    // 保存消息到messages,links 再保存完成后发给客户端
    this.saveMessage(data);
  }
  // 已读处理
  @SubscribeMessage('readed')
  async readed(client: WebSocket, data: { link_id: number }): Promise<void> {
    let result = await this.linksRepository.findOne({ id: data.link_id });
    if (result && result.unread_count === 0) return;
    result.unread_count = 0;
    await this.linksRepository.save(result);
  }

  handleConnection(client: WebSocket) {
    // 初始化
    let verify = this.authService.verify(client.protocol);
    if (verify) {
      this.createConnect(verify.sub, client);
    } else {
      // 主动关闭连接
      client.send(transferToString({ type: 'rejectConnect' }));
      client.close();
    }
    // client.close();
  }

  handleDisconnect(client: WebSocket) {
    // 客户端断开
    let sub: number = this.authService.decode(client.protocol).sub;
    this.close(sub);
  }

  createConnect(sub: number, client: WebSocket) {
    this.usersOnline[sub] = client;
  }

  close(userId: number) {
    Reflect.deleteProperty(this.usersOnline, userId);
  }

  send(receiveId: number, data: MessageDto) {
    // 给某人发送消息
    let client = this.usersOnline[receiveId];
    if (client) client.send(transferToString(data));
  }

  async saveMessage(data: MessageDto) {
    let { send_id, receive_id, message, send_user, receive_user } = data;
    let linksResult: Links;
    let messagesResult: Messages;
    let publicId = sortReturnString(receive_id, send_id);
    let commonData = { message, send_id, receive_id, public_id: publicId, type: messageTypeEnum[0] };
    let linksData = { ...commonData, ...{ unread_count: 1 } };

    // 这里往下 还有liks_id 和message_id需要修改下, 等后面测试的时候看下保存/修改的返回值, 修改下id
    // `(send_id = ${send_id} AND receive_id = ${receive_id}) OR (send_id = ${receive_id} AND receive_id = ${send_id})`
    try {
      linksResult = await this.linksRepository
        .createQueryBuilder()
        .where(`public_id = '${publicId}'`)
        .getOne();
      if (linksResult) {
        linksData.unread_count = linksResult.unread_count + 1;
        await this.linksRepository.update(linksResult.id, linksData);
      } else {
        linksResult = await this.linksRepository.save(linksData);
      }

      messagesResult = await this.messafessRepository.save(commonData);
      let subObject = {
        message_id: messagesResult.id,
        update_at: messagesResult.update_at,
        create_at: messagesResult.create_at
      };

      // 给对方发
      this.send(receive_id, {
        type: 'NewMessage',
        message,
        send_id,
        receive_id,
        link_id: linksResult.id,
        receive_user,
        send_user,
        ...subObject
      });

      // 给自己发
      this.send(send_id, {
        type: 'NewMessage',
        ...data,
        ...subObject,
        id: messagesResult.id,
        link_id: linksResult.id
      });
    } catch (err) {
      console.log(err);
    }
  }
}
