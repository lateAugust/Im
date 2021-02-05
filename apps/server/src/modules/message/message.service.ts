import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagesDto } from '../../dto/common/pages.dto';
import { MessageListDto } from '../../dto/message/message.dto';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';
import { LinksListRaw, LinksList } from '../../interface/message/message.interface';
import { ReturnBody } from '../../utils/return-body';
import { processIncludeUnderlineKeyObject } from '../../utils/utils';

const env = process.env;
let { PAGE, PAGE_SIZE } = env;

let defaultPage = Number(PAGE);
let defaultPageSize = Number(PAGE_SIZE);
@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages) private readonly messageRepository: Repository<Messages>,
    @InjectRepository(Links) private readonly linksRepository: Repository<Links>
  ) {}
  getHello(): string {
    return 'hello message';
  }
  async getMessageList(
    { receive_id, send_id, page, page_size, message_id, type }: MessageListDto,
    user_id: number
  ): Promise<ReturnBody<Messages[]>> {
    page = Number(page) || defaultPage;
    page_size = Number(page_size) || defaultPageSize;
    message_id = Number(message_id) || 0;
    type = type || 'message';
    try {
      let startSql = message_id ? 'AND id < ' + message_id : '';
      let notificationSql = type === 'notification' ? `type = '${type}' AND receive_id = ${user_id}` : '';
      let messageSql = `type = 'message' AND ((send_id = ${send_id} AND receive_id= ${receive_id}) OR (receive_id=${send_id} AND send_id = ${receive_id})) ${startSql}`;
      let result = await this.messageRepository
        .createQueryBuilder()
        .where(notificationSql || messageSql)
        // .skip(Math.max(0, page - 1) * page_size)
        .take(page_size)
        .orderBy('update_at', 'DESC')
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
  async getLinks({ page_size, page }: PagesDto, user_id: number): Promise<ReturnBody<LinksList[]>> {
    page = Number(page) || defaultPage;
    page_size = Number(page_size) || defaultPageSize;
    try {
      let builder = await this.linksRepository
        .createQueryBuilder('link')
        .leftJoinAndSelect(
          'users',
          'user',
          `(user.id = link.send_id OR user.id = link.receive_id) AND user.id <> ${user_id}`
        )
        .distinct(true)
        .select([
          'link.id',
          'link.send_id',
          'link.receive_id',
          'link.unread_count',
          'link.title',
          'link.type',
          'link.update_at',
          'link.create_at',
          'link.message',
          'user.id',
          'user.username',
          'user.avatar',
          'user.nickname',
          'user.age',
          'user.gender',
          'user.pin_yin'
        ])
        .where(
          `IF(link.type = 'notification',link.receive_id = ${user_id},link.send_id = ${user_id} OR link.receive_id = ${user_id})`
        )
        .limit(page_size)
        .offset(Math.max(0, page - 1) * page_size)
        .orderBy('link.update_at', 'DESC');
      // .getManyAndCount();
      let result = await builder.getRawMany<LinksListRaw>();
      let total = await builder.getCount();
      return {
        page,
        page_size,
        data: processIncludeUnderlineKeyObject<LinksListRaw, LinksList>(result),
        total,
        statusCode: 200,
        status: true,
        message: '获取成功'
      };
    } catch (err) {
      throw new HttpException({ data: err, statusCode: 500, status: false, message: '获取失败' }, 500);
    }
  }
}
