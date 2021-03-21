import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagesDto } from '../../dto/common/pages.dto';
import { MessageListDto } from '../../dto/message/message.dto';
import { Links } from '../../emtites/message/links.emtity';
import { Messages } from '../../emtites/message/messages.emtity';
import { LinksListRaw, LinksList } from '../../common/interface/message/message.interface';
import { ReturnBody } from '../../utils/returnBody';
import { formatRawData, leftJoinOn, sortReturnString, wherePublicId } from '../../utils/utils';
import { userBase } from '../../common/select/user';
import { linkBase, linkDetail, linkOther } from '../../common/select/messages/link';
import { link } from 'fs';

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
    type = type || 'Message';
    try {
      let sql: string;
      switch (type) {
        case 'Message':
          sql = `'${sortReturnString(receive_id, send_id)}' = public_id`;
          break;
        case 'NewFriendNotification':
          sql = `belong_id = ${user_id}`;
          break;
      }
      let result = await this.messageRepository
        .createQueryBuilder()
        .where(`type = '${type}' AND ${sql}`)
        // .skip(Math.max(0, page - 1) * page_size)
        .take(page_size)
        .orderBy('update_at', 'DESC')
        .getManyAndCount();
      return { page, page_size, data: result[0], total: result[1], statusCode: 200, status: true, message: '获取成功' };
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
        .leftJoin('users', 'user', 'TRUE')
        .select([...linkBase, ...linkDetail, ...linkOther, ...userBase])
        .where(`IF(link.belong_id IS NULL, ${leftJoinOn('link', 'user.id', user_id)}, user.id = ${user_id})`)
        .limit(page_size)
        .offset(Math.max(0, page - 1) * page_size)
        .orderBy('link.update_at', 'DESC');
      // .getManyAndCount();
      let result = await builder.getRawMany<LinksListRaw>();
      let total = await builder.getCount();
      return {
        page,
        page_size,
        data: formatRawData<LinksListRaw, LinksList>(result),
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
