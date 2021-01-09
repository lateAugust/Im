import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { PagesDto } from '../../dto/common/pages.dto';
import { ApplyDto, FriendsAuditDto, FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { Friends } from '../../emtites/friends/friends.emtity';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { Users } from '../../emtites/users/users.entity';
import { ReturnBody } from '../../utils/return-body';
import { pagination, processIncludeUnderlineKeyObject } from '../../utils/utils';

import {
  FriendsSearchingInterface,
  FriendsSearchingListInterface,
  FriendsSearchingDetailInterface,
  FriendsSearchingDetailRawInterface
} from '../../interface/friends.interface';

const env = process.env;
let { PAGE, PAGE_SIZE } = env;

let defaultPage = Number(PAGE);
let defaultPageSize = Number(PAGE_SIZE);
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Proposers) private readonly proposersRepository: Repository<Proposers>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Friends) private readonly friendsRepository: Repository<Friends>
  ) {}

  /**
   * 检索可添加的用户
   * @param query
   * @param req
   */
  async searching(
    { page, page_size, keywords }: FriendsSearchingDto,
    id: number
  ): Promise<ReturnBody<FriendsSearchingListInterface[] | []>> {
    page = page || defaultPage;
    page_size = page_size || defaultPageSize;
    try {
      const builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('friends', 'friend', 'user.id <> friend.relation_id')
        .leftJoinAndSelect('proposers', 'proposer', 'user.id = proposer.target_id')
        .select([
          'user.id',
          'user.username',
          'user.nickname',
          'user.avatar',
          'user.gender',
          'user.age',
          'proposer.id',
          'proposer.message',
          'friend.id'
        ])
        .where('user.id <> :id', { id })
        .andWhere(`instr(user.username, '${keywords}') > 0 OR instr(user.mobile, '${keywords}') > 0`)
        .skip(Math.max(0, page - 1) * page_size)
        .take(page_size);
      let list = await builder.getRawMany<FriendsSearchingInterface>();
      let count = await builder.getCount();
      let data = processIncludeUnderlineKeyObject<FriendsSearchingInterface, FriendsSearchingListInterface>(list);
      return { status: true, statusCode: 200, message: '获取成功', data, total: count, page, page_size };
    } catch (err) {
      return { message: '网络错误, 请重试', status: false, statusCode: 500, data: err };
    }
  }
  /**
   * 待添加用户详情
   * @param id 用户id
   * @param proposer_id proposers表id
   */
  async searchingDetail(id: number, proposer_id: number): Promise<ReturnBody<FriendsSearchingDetailInterface | {}>> {
    try {
      let builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('proposers', 'proposer', 'user.id = proposer.target_id', { id: proposer_id })
        .select([
          'user.id',
          'user.username',
          'user.nickname',
          'user.age',
          'user.gender',
          'user.avatar',
          'user.mobile',
          'user.email',
          'user.address',
          'proposer.id',
          'proposer.message'
        ])
        .where('user.id = :id', { id });
      let user = await builder.getRawOne<FriendsSearchingDetailRawInterface>();
      let data = processIncludeUnderlineKeyObject<FriendsSearchingDetailRawInterface, FriendsSearchingDetailInterface>([
        user
      ])[0];
      return { status: true, statusCode: 200, message: '获取成功', data };
    } catch (err) {
      return { message: '获取失败', status: false, statusCode: 500, data: err };
    }
  }

  /**
   * 创建/修改(message)好友申请
   */
  async createApply(params: ApplyDto): Promise<ReturnBody<{}>> {
    try {
      let message = '申请已发送';
      if (params.proposers_id) {
        message = '修改成功';
        let data = await this.proposersRepository.findOne({ id: params.proposers_id });
        await this.proposersRepository.save(Object.assign({}, data, { message: params.message }));
      } else {
        await this.proposersRepository.save(params);
      }
      return { message, status: true, statusCode: 200, data: {} };
    } catch (e) {
      let message = params.proposers_id ? '修改失败' : '申请发送失败';
      return { message, status: false, statusCode: 500, data: e };
    }
  }

  /**
   * 被申请添加好友的列表
   * @param query
   * @param req
   */
  async appliyList({ page_size, page }: PagesDto, id: number): Promise<ReturnBody<Proposers[] | []>> {
    page = page || 1;
    page_size = page_size || 10;
    let sql =
      `SELECT SQL_CALC_FOUND_ROWS * FROM proposers 
    WHERE apply_id = ${id} AND 'status'<>'agreement' ORDER BY id LIMIT` + pagination(page, page_size);
    try {
      let result = await this.proposersRepository.query(sql);
      let totalResult = await this.usersRepository.query('SELECT FOUND_ROWS()');
      let total = totalResult[0]['FOUND_ROWS()'] * 1;
      return { status: true, statusCode: 200, message: '获取成功', data: result, total, page, page_size };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }
  /**
   * 处理添加好友申请
   * @param query
   */
  async auditApply(query: FriendsAuditDto, id: string): Promise<ReturnBody<{}>> {
    let message = '';
    try {
      switch (query.apply_status) {
        case 'agreement':
          message = '添加成功';
          await this.proposersRepository.query(`UPDATE proposers SET apply_status=agreement WHERE id=${id}`);
          Reflect.deleteProperty(query, 'message');
          await this.friendsRepository.save(query);
          break;
        case 'reject':
          message = '对方已拒绝';
          await this.proposersRepository.query(`UPDATE proposers SET apply_status=reject WHERE id=${id}`);
          break;
      }
    } catch (err) {
      return { status: false, statusCode: 500, data: err, message: '添加失败, 请重试' };
    }
    return { statusCode: 200, message, status: true, data: {} };
  }

  /**
   * 朋友列表
   * @param query
   * @param req
   */
  async friendsList({ page_size, page }: PagesDto, id: number): Promise<ReturnBody<Friends[] | []>> {
    page_size = page_size || 10;
    page = page || 1;
    let sql =
      `SELECT SQL_CALC_FOUND_ROWS * FROM friends 
    WHERE relation_id = ${id} OR target_id = ${id} ORDER BY id LIMIT` + pagination(page, page_size);
    try {
      let result = await this.proposersRepository.query(sql);
      let totalResult = await this.usersRepository.query('SELECT FOUND_ROWS()');
      let total = totalResult[0]['FOUND_ROWS()'] * 1;
      return { status: true, statusCode: 200, message: '获取成功', data: result, total, page, page_size };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }
}
