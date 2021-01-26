import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository, QueryFailedError } from 'typeorm';
import { PagesDto } from '../../dto/common/pages.dto';
import {
  ApplyDto,
  FriendsApplyListDto,
  FriendsAuditDto,
  FriendsDetailDeto,
  FriendsSearchingDto
} from '../../dto/friends/friends.dto';
import { Friends } from '../../emtites/friends/friends.emtity';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { Users } from '../../emtites/users/users.entity';
import { ReturnBody } from '../../utils/return-body';
import { pagination, processIncludeUnderlineKeyObject, sortReturnString } from '../../utils/utils';

import {
  FriendsSearchingInterface,
  FriendsApplyCountInterface,
  FriendsSearchingBodyInterface,
  FriendsListInterface,
  FriendsListBodyInterface,
  FriendsListDetailInterFace
} from '../../interface/friends/friends.interface';

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
  ): Promise<ReturnBody<FriendsSearchingBodyInterface[] | []>> {
    page = page || defaultPage;
    page_size = page_size || defaultPageSize;
    try {
      // 查询的逻辑, 先去检索users表, 然后用users.id和当前登录的用户id降序排序拼接成ids
      // 再是users.id和proposer.target_id比较; 如果等于, 那么说明是申请用户在继续查询; 不等于说明是被申请方在查询;
      // 那么对应的按钮逻辑就是:
      //     申请方: 未添加过是添加; 添加了但是还没通过是申请中, 此时可以修改message 同意了是发消息;
      //     被申请方: 自己还未同意是待验证, 进到同意页面; 同意了是发消息; 如果拒绝了就是已拒绝
      const builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'friends',
          'friend',
          `IF( ${id} > user.id, CONCAT( user.id, ',', ${id} ), CONCAT( ${id}, ',', user.id )) = friend.ids`
        )
        .leftJoinAndSelect(
          'proposers',
          'proposer',
          `IF(user.id = proposer.target_id,user.id = proposer.target_id AND proposer.apply_id = ${id},user.id=proposer.apply_id AND proposer.target_id = ${id})`
        )
        .distinct(true)
        .select([
          'user.id',
          'user.username',
          'user.nickname',
          'user.avatar',
          'user.gender',
          'user.age',
          'user.pin_yin',
          'proposer.id',
          'proposer.message',
          'friend.id',
          'proposer.apply_status',
          'proposer.target_id'
        ])
        .where(
          `user.id <> ${id} AND (instr(IF(user.nickname IS NULL,user.username,user.nickname), '${keywords}') > 0 OR instr(user.mobile, '${keywords}') > 0)`
        )
        .skip(Math.max(0, page - 1) * page_size)
        .take(page_size);
      let list = await builder.getRawMany<FriendsSearchingInterface>();
      let count = await builder.getCount();
      let data = processIncludeUnderlineKeyObject<FriendsSearchingInterface, FriendsSearchingBodyInterface>(list);
      return { status: true, statusCode: 200, message: '获取成功', data, total: count, page, page_size };
    } catch (err) {
      return { message: '网络错误, 请重试', status: false, statusCode: 500, data: err };
    }
  }

  /**
   * 待添加用户详情
   * @param id proposers.contact_id
   * @param proposer_id proposers.id
   */
  async searchingDetail(
    id: number,
    proposer_id: number,
    user_id: number
  ): Promise<ReturnBody<FriendsSearchingBodyInterface | {}>> {
    try {
      let builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'friends',
          'friend',
          `IF( ${user_id} > user.id, CONCAT( user.id, ',', ${user_id} ), CONCAT( ${user_id}, ',', user.id )) = friend.ids`
        )
        .leftJoin('proposers', 'proposer', `proposer.id = ${proposer_id}`)
        .distinct(true)
        .select([
          'user.id',
          'user.username',
          'user.nickname',
          'user.age',
          'user.gender',
          'user.pin_yin',
          'user.avatar',
          'user.mobile',
          'user.email',
          'user.address',
          'proposer.id',
          'proposer.message',
          'proposer.apply_status',
          'proposer.target_id',
          'friend.id'
        ])
        .where('user.id = :id', { id });
      let user = await builder.getRawOne<FriendsSearchingInterface>();
      let data = processIncludeUnderlineKeyObject<FriendsSearchingInterface, FriendsSearchingBodyInterface>([user])[0];
      return { status: true, statusCode: 200, message: '获取成功', data };
    } catch (err) {
      return { message: '获取失败', status: false, statusCode: 500, data: err };
    }
  }

  /**
   * 创建/修改(message)/重新申请/好友申请
   */
  async createApply(params: ApplyDto, id: number): Promise<ReturnBody<Proposers | {}>> {
    try {
      let message = '申请已发送';
      let result: Proposers;
      let isReject = params.is_review !== 'reject';
      if (params.proposers_id) {
        if (isReject) message = '修改成功';
        let data = await this.proposersRepository.findOne({ id: params.proposers_id });
        let _params = { ...params };
        Reflect.deleteProperty(_params, 'proposers_id');
        result = await this.proposersRepository.save(Object.assign({}, data, _params));
      } else {
        result = await this.proposersRepository.save(params);
      }
      return { message, status: true, statusCode: 200, data: result };
    } catch (e) {
      let message = params.proposers_id ? '修改失败' : '申请发送失败';
      return { message, status: false, statusCode: 500, data: e };
    }
  }

  /**
   * 获取待处理的添加好友请求数量
   * id 当前登录的用户id
   */
  async applyCount(id: number): Promise<ReturnBody<FriendsApplyCountInterface>> {
    try {
      let count = await this.proposersRepository
        .createQueryBuilder('proposer')
        .where('proposer.target_id = :id', { id })
        .andWhere(`proposer.apply_status = \'underReview\'`)
        .getCount();
      return { message: '获取成功', status: false, statusCode: 200, data: { count } };
    } catch (err) {
      return { message: '获取失败', status: false, statusCode: 500, data: err };
    }
  }

  /**
   * 被申请添加好友的列表
   * @param query
   * @param req
   */
  async applyList(
    { page_size, page, type, keywords }: FriendsApplyListDto,
    id: number
  ): Promise<ReturnBody<Proposers[] | []>> {
    page = page || defaultPage;
    page_size = page_size || defaultPageSize;
    type = type || 'underReview';
    try {
      let result = await this.proposersRepository
        .createQueryBuilder('proposer')
        .where('target_id = :id', { id })
        .andWhere(
          `apply_status = \'${type}\' ` +
            (keywords
              ? `AND (instr(json_extract(proposer.apply_user,IF('$.nickname' IS NULL,'$.username','$.nickname')), '${keywords}') > 0 OR instr(json_extract(proposer.target_user,'$.mobile'), '${keywords}') > 0)`
              : '')
        )
        .getManyAndCount();
      return { status: true, statusCode: 200, message: '获取成功', data: result[0], total: result[1], page, page_size };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }

  /**
   * 获取申请列表详情
   * @param id
   */
  async applyDetail(id: number): Promise<ReturnBody<Proposers | {}>> {
    try {
      let reulst = await this.proposersRepository.findOne({ id });
      return { status: true, statusCode: 200, message: '获取成功', data: reulst };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }
  /**
   * 处理添加好友申请
   * @param query
   */
  async auditApply(query: FriendsAuditDto, id: number, user_id: number): Promise<ReturnBody<Proposers | Friends | {}>> {
    let message = '';
    let result: Friends | Proposers;
    try {
      switch (query.apply_status) {
        case 'agreement':
          message = '添加成功';
          // ids[0] = relation_id, ids[1] = contact_id
          // relation_id = relation_user.id, contact_id = contact_user.id
          let relation_id: number = 0;
          let contact_id: number = 0;
          let relation_user: object = {};
          let contact_user: object = {};
          let ids: string = '';
          let apply_id: number = query.relation_id === user_id ? query.contact_id : query.relation_id;
          if (query.relation_id < query.contact_id) {
            relation_id = query.contact_id;
            contact_id = query.relation_id;
            ids = [contact_id, relation_id].join(',');
            relation_user = query.contact_user;
            contact_user = query.relation_user;
          } else {
            contact_id = query.relation_id;
            relation_id = query.contact_id;
            ids = [relation_id, contact_id].join(',');
            contact_user = query.relation_user;
            relation_user = query.contact_user;
          }
          result = await this.friendsRepository.save({
            ids,
            contact_id,
            contact_user,
            relation_id,
            relation_user,
            agree_id: user_id,
            apply_id
          });
          await this.proposersRepository.query(
            `UPDATE proposers SET apply_status='agreement',friend_id=${result.id} WHERE id=${id}`
          );
          break;
        case 'reject':
          message = '已拒绝';
          let data = await this.proposersRepository.findOne({ id });
          data.apply_status = 'reject';
          result = await this.proposersRepository.save(data);
          break;
        default:
          new Error('添加失败');
          break;
      }
    } catch (err) {
      return { status: false, statusCode: 500, data: err, message: '添加失败, 请重试' };
    }
    return { statusCode: 200, message, status: true, data: result };
  }

  /**
   * 朋友列表
   * @param query
   * @param req
   */
  async friendsList(id: number): Promise<ReturnBody<FriendsListBodyInterface[]>> {
    try {
      let builder = await this.friendsRepository
        .createQueryBuilder('friend')
        .leftJoin('users', 'user', 'friend.relation_id = user.id OR friend.contact_id = user.id')
        .distinct(true)
        .select([
          'user.id',
          'user.username',
          'user.age',
          'user.gender',
          'user.avatar',
          'user.pin_yin',
          'user.nickname',
          'friend.id',
          'friend.apply_id',
          'friend.relation_id',
          'friend.agree_id',
          'friend.contact_id',
          'friend.update_at',
          'friend.create_at'
        ])
        .where(
          `(friend.relation_id = user.id AND friend.contact_id = ${id}) OR (friend.contact_id = user.id AND friend.relation_id = ${id})`
        )
        .orderBy(`CONVERT(user.pin_yin USING gbk)`, 'ASC');
      // where 如果relation_id/contact_id 和当前登录用户id对得上, 说明是建立了好友关系的, 返回的就是当前用户
      // 利用关联外连接查询, 以friends表为主, users为辅, leftJoin先查询符合的user, 建立临时表, 再到下面的where筛选一次
      let total = await builder.getCount();
      let list = await builder.getRawMany<FriendsListInterface>();
      let data = processIncludeUnderlineKeyObject<FriendsListInterface, FriendsListBodyInterface>(list);
      return {
        status: true,
        statusCode: 200,
        message: '获取成功',
        data,
        total
      };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }

  async friendsDetail(query: FriendsDetailDeto): Promise<ReturnBody<FriendsListDetailInterFace>> {
    try {
      let result = await this.friendsRepository
        .createQueryBuilder('friend')
        .leftJoin('users', 'user', `user.id = ${query.user_id}`)
        .select([
          'user.id',
          'user.username',
          'user.nickname',
          'user.avatar',
          'user.pin_yin',
          'user.gender',
          'user.age',
          'user.mobile',
          'user.address',
          'user.email',
          'user.create_at',
          'friend.id',
          'friend.apply_id',
          'friend.relation_id',
          'friend.agree_id',
          'friend.contact_id',
          'friend.update_at',
          'friend.create_at'
        ])
        .where(`friend.id = ${query.friend_id}`)
        .getRawOne<FriendsListDetailInterFace>();

      let data = processIncludeUnderlineKeyObject<FriendsListDetailInterFace, FriendsListDetailInterFace>([result]);
      return { status: true, statusCode: 200, message: '获取成功', data: data[0] };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }
}
