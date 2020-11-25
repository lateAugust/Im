import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import WebSocket, { Server } from 'ws';
import { Links } from '../../emtites/events/links.emtity';

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(@InjectRepository(Links) private readonly linksRepository: Repository<Links>) {}

  @SubscribeMessage('message')
  onEvent(client: WebSocket, data: any): Observable<WsResponse<number>> {
    console.log(data);
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
}
