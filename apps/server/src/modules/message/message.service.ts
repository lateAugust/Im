import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageListDeto } from '../../dto/message/message.dto';
import { Messages } from '../../emtites/events/messages.emtity';
import { ReturnBody } from '../../utils/return-body';

const env = process.env;
let { PAGE, PAGE_SIZE } = env;

let defaultPage = Number(PAGE);
let defaultPageSize = Number(PAGE_SIZE);
@Injectable()
export class MessageService {
  constructor(@InjectRepository(Messages) private readonly messageRepository: Repository<Messages>) {}
  getHello(): string {
    return 'hello message';
  }
  async getMessageList({
    receive_id,
    send_id,
    page,
    page_size,
    message_id
  }: MessageListDeto): Promise<ReturnBody<Messages[]>> {
    page = Number(page) || defaultPage;
    page_size = Number(page_size) || defaultPageSize;
    message_id = Number(message_id) || 0;
    try {
      let startSql = message_id ? 'AND id < ' + message_id : '';
      let result = await this.messageRepository
        .createQueryBuilder()
        .where(
          `((send_id = ${send_id} OR receive_id= ${receive_id}) OR (receive_id=${send_id} AND send_id = ${receive_id})) ${startSql}`
        )
        // .skip(Math.max(0, page - 1) * page_size)
        .take(page_size)
        .orderBy('id', 'DESC')
        .getMany();
      // .getManyAndCount();
      return {
        page,
        page_size,
        data: result,
        // total: result[1],
        statusCode: 200,
        status: true,
        message: '获取成功'
      };
    } catch (err) {
      throw new HttpException({ data: err, statusCode: 500, status: false, message: '获取失败' }, 500);
    }
  }
}
