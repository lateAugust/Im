// modules
import { HttpException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository, QueryFailedError } from 'typeorm';

// interface
import {
  FriendsSearchingInterface,
  FriendsApplyCountInterface,
  FriendsSearchingBodyInterface,
  FriendsListInterface,
  FriendsListBodyInterface,
  FriendsListDetailInterFace,
  FriendsListDetailRawInterFace,
  ProposerApplyListRawInterface,
  ProposerApplyListInterface
} from '../../common/interface/friends/friends.interface';

// getway
import { EventsGateway } from '../events/events.gateway';

// dto
import {
  ApplyDto,
  FriendsApplyListDto,
  FriendsAuditDto,
  FriendsDetailDeto,
  FriendsSearchingDto
} from '../../dto/friends/friends.dto';

// emtity
import { Friends } from '../../emtites/friends/friends.emtity';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { Users } from '../../emtites/users/users.entity';
import { Links } from '../../emtites/message/links.emtity';
import { Messages } from '../../emtites/message/messages.emtity';

// utils
import { ReturnBody } from '../../utils/returnBody';
import { pagination, formatRawData, sortReturnString, leftJoinOn } from '../../utils/utils';

// select
import { userBase, userOther } from '../../common/select/user';
import { friendBase, friendDetail } from '../../common/select/friend';
import { proposerBase } from '../../common/select/proposer';
import { linkBase } from '../../common/select/messages/link';

const env = process.env;
let { PAGE, PAGE_SIZE } = env;

let defaultPage = Number(PAGE);
let defaultPageSize = Number(PAGE_SIZE);
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Proposers) private readonly proposersRepository: Repository<Proposers>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Friends) private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(Links) private readonly linksRepository: Repository<Links>,
    @InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,
    private readonly eventsGetway: EventsGateway
  ) {}

  /**
   * 检索可添加的用户
   * @param query
   * @param req
   */
  async searching(
    { page, page_size, keywords }: FriendsSearchingDto,
    id: number
  ): Promise<ReturnBody<FriendsSearchingBodyInterface[]>> {
    page = page || defaultPage;
    page_size = page_size || defaultPageSize;
    try {
      // 查询的逻辑, 先去检索users表, 然后用users.id和当前登录的用户id使用mysql正则匹配
      // 再是users.id和当前登录的用户id使用mysql正则匹配; 如果等于, 那么说明是申请用户在继续查询; 不等于说明是被申请方在查询;
      // 那么对应的按钮逻辑就是:
      //     申请方: 未添加过是添加; 添加了但是还没通过是申请中, 此时可以修改message 同意了是发消息;
      //     被申请方: 自己还未同意是待验证, 进到同意页面; 同意了是发消息; 如果拒绝了就是已拒绝
      const builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('friends', 'friend', leftJoinOn('friend', 'user.id', id))
        .leftJoinAndSelect('proposers', 'proposer', leftJoinOn('proposer', 'user.id', id))
        .distinct(true)
        .select([...userBase, ...friendBase, ...proposerBase])
        .where(
          `user.id <> ${id} AND (instr(IF(user.nickname IS NULL,user.username,user.nickname), '${keywords}') > 0 OR instr(user.mobile, '${keywords}') > 0)`
        )
        .limit(page_size)
        .offset(Math.max(0, page - 1) * page_size);
      let list = await builder.getRawMany<FriendsSearchingInterface>();
      let count = await builder.getCount();
      let data = formatRawData<FriendsSearchingInterface, FriendsSearchingBodyInterface>(list);
      return { status: true, statusCode: 200, message: '获取成功', data, total: count, page, page_size };
    } catch (err) {
      throw new HttpException({ data: err, statusCode: 500, status: false, message: '获取失败' }, 500);
    }
  }

  /**
   * 待添加用户详情
   * @param id proposers.contact_id
   * @param proposer_id proposers.id
   */
  async searchingDetail(id: number, proposer_id: number): Promise<ReturnBody<FriendsSearchingBodyInterface>> {
    try {
      let builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('friends', 'friend', `friend.public_id REGEXP '(^user.id,${id}$|^${id},user.id$)'`)
        .leftJoin('proposers', 'proposer', `proposer.id = ${proposer_id}`)
        .distinct(true)
        .select([...userBase, ...userOther, ...proposerBase, ...friendBase])
        .where('user.id = :id', { id });
      let user = await builder.getRawOne<FriendsSearchingInterface>();
      let data = formatRawData<FriendsSearchingInterface, FriendsSearchingBodyInterface>([user])[0];
      return { status: true, statusCode: 200, message: '获取成功', data };
    } catch (err) {
      throw new HttpException({ message: '获取失败', status: false, statusCode: 500, data: err }, 500);
    }
  }

  /**
   * 创建/修改(message)/重新申请/好友申请
   * 第一次申请和拒绝重新申请会通知到对方, underReview修改不会通知
   * 这里注意is_review是和apply_status保持一致的, 如果是第一次创建, 那么就为空字符串
   */
  async createApply(params: ApplyDto, id: number): Promise<ReturnBody<Proposers>> {
    try {
      let message = '申请已发送';
      let result: Proposers;
      let isReject = params.is_review !== 'reject';
      if (params.proposers_id) {
        if (isReject) message = '修改成功';
        let data = await this.proposersRepository.findOne({ id: params.proposers_id });
        let _params = { ...params };
        Reflect.deleteProperty(_params, 'proposers_id');
        Reflect.deleteProperty(_params, 'apply_user');
        Reflect.deleteProperty(_params, 'target_user');
        result = await this.proposersRepository.save(Object.assign({}, data, _params));
      } else {
        console.log(sortReturnString(params.target_id, params.apply_id));
        result = await this.proposersRepository.save({
          ...params,
          public_id: sortReturnString(params.target_id, params.apply_id)
        });
      }
      if (params.is_review !== 'underReview') {
        // 通知到客户端
        this.eventsGetway.send(params.target_id, {
          type: 'NewApplyNotification',
          send_id: id,
          receive_id: params.target_id,
          message: '',
          send_user: params.apply_user,
          receive_user: params.target_user
        });
      }
      return { message, status: true, statusCode: 200, data: result };
    } catch (err) {
      let message = params.proposers_id ? '修改失败' : '申请发送失败';
      throw new HttpException({ message, status: false, statusCode: 500, data: err }, 500);
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
      throw new HttpException({ message: '获取失败', status: false, statusCode: 500, data: err }, 500);
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
  ): Promise<ReturnBody<ProposerApplyListInterface[]>> {
    page = page || defaultPage;
    page_size = page_size || defaultPageSize;
    type = type || 'underReview';
    try {
      let builder = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'proposers',
          'proposer',
          `(proposer.target_id = ${id} AND proposer.apply_status = \'${type}\') `
        )
        .select([...userBase, ...proposerBase])
        .where(
          `user.id = proposer.apply_id ${
            keywords
              ? ` AND instr(IF('user.nickname' IS NULL,'user.username','user.nickname'), '${keywords}') > 0 OR instr(user.mobile, '${keywords}') > 0`
              : ''
          }`
        )
        .limit(page_size)
        .offset(Math.max(0, page - 1) * page_size);
      let rawList = await builder.getRawMany<ProposerApplyListRawInterface>();
      let total = await builder.getCount();
      let list = formatRawData<ProposerApplyListRawInterface, ProposerApplyListInterface>(rawList);
      return { status: true, statusCode: 200, message: '获取成功', data: list, total, page, page_size };
    } catch (err) {
      throw new HttpException({ status: false, statusCode: 500, message: '获取失败', data: err }, 500);
    }
  }

  /**
   * 获取申请列表详情
   * @param id
   */
  async applyDetail(id: number): Promise<ReturnBody<ProposerApplyListInterface>> {
    try {
      let rawData = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('proposers', 'proposer', `proposer.id = ${id}`)
        .select([...userBase, ...proposerBase])
        .where(`user.id = proposer.apply_id`)
        .getRawOne<ProposerApplyListRawInterface>();
      let data = formatRawData<ProposerApplyListRawInterface, ProposerApplyListInterface>([rawData]);
      return { status: true, statusCode: 200, message: '获取成功', data: data[0] };
    } catch (err) {
      return { status: false, statusCode: 500, message: '获取失败', data: err };
    }
  }
  /**
   * 处理添加好友申请
   * @param query
   */
  async auditApply(query: FriendsAuditDto, id: number, user_id: number): Promise<ReturnBody<Proposers | Friends>> {
    let result: Friends | Proposers;
    let { apply_status, apply_id, message, proposers_id, apply_user } = query;
    try {
      let checkAdd = await this.proposersRepository.findOne({ id });
      if (checkAdd.apply_status !== 'underReview') {
        throw new HttpException({ status: false, statusCode: 403, data: {}, message: '已添加过了' }, 403);
      }
    } catch (err) {
      throw new HttpException({ status: false, statusCode: 500, data: err, message: '服务器错误' }, 500);
    }
    let publicId = sortReturnString(apply_id, user_id);
    let currentUser = await this.usersRepository.findOne({ id: user_id });
    let notificationContent = currentUser.nickname || currentUser.username;
    let operationMessage = '已同意';
    let type: string;
    try {
      switch (apply_status) {
        case 'agreement':
          notificationContent += '同意了您的请求';
          type = 'NewFriendNotification';
          result = await this.friendsRepository.save({
            public_id: publicId,
            agree_id: user_id,
            apply_id
          });
          await this.proposersRepository.query(
            `UPDATE proposers SET apply_status='agreement',friend_id=${result.id} WHERE id=${proposers_id}`
          );
          break;
        case 'reject':
          type = 'RejectendNotification';
          operationMessage = '已拒绝';
          notificationContent += '拒绝了您的好友请求';
          let data = await this.proposersRepository.findOne({ id });
          data.apply_status = 'reject';
          data.reject_message = message;
          result = await this.proposersRepository.save(data);
          break;
        default:
          new Error('添加失败');
          break;
      }
      // 下面是存到links和message表中, save执行成功后通知到申请方
      // 原则上belong_id应该和receive_id相等
      let send_id = user_id;
      let receive_id = apply_id;
      let link_id: number;
      this.linksRepository
        .createQueryBuilder()
        .where('belong_id = :id', { id: apply_id })
        .getOne()
        .then(res => {
          // 是否已添加过, 添加过时修改, 否则新增
          if (res) {
            res.message = notificationContent;
            res.unread_count++;
            return this.linksRepository.save(res);
          } else {
            return this.linksRepository.save({
              send_id,
              receive_id,
              belong_id: apply_id,
              message: notificationContent,
              type: 'NewFriendNotification',
              unread_count: 1,
              title: '好友验证'
              // public_id: publicId
            });
          }
        })
        .then(res => {
          // 存入新消息
          link_id = res.id;
          return this.messagesRepository.save({
            send_id,
            receive_id,
            public_id: publicId,
            message: notificationContent,
            belong_id: receive_id,
            type: 'NewFriendNotification',
            proposers_id: proposers_id
          });
        })
        .then(res => {
          // 通知到客户端
          this.eventsGetway.send(apply_id, {
            type,
            send_id,
            receive_id,
            message: notificationContent,
            receive_user: apply_user,
            proposers_id,
            send_user: {
              id: currentUser.id,
              username: currentUser.username,
              nickname: currentUser.nickname,
              age: currentUser.age,
              gender: currentUser.gender,
              avatar: currentUser.avatar
            },
            link_id
          });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      throw new HttpException({ status: false, statusCode: 500, data: err, message: '添加失败, 请重试' }, 500);
    }
    return { statusCode: 200, message: operationMessage, status: true, data: result };
  }

  /**
   * 朋友列表
   * @param query
   * @param req
   */
  async friendsList(id: number): Promise<ReturnBody<FriendsListBodyInterface[]>> {
    try {
      // 利用关联外连接查询, 以friends表为主, users为辅, leftJoin先查询符合的user, 建立临时表
      let builder = await this.friendsRepository
        .createQueryBuilder('friend')
        .leftJoin('users', 'user', leftJoinOn('friend', 'user.id', id))
        .select([...userBase, ...friendBase, ...friendDetail])
        .where(`user.id IS NOT NULL`)
        .orderBy(`CONVERT(user.pin_yin USING gbk)`, 'ASC');
      let total = await builder.getCount();
      let list = await builder.getRawMany<FriendsListInterface>();
      let data = formatRawData<FriendsListInterface, FriendsListBodyInterface>(list);
      return {
        status: true,
        statusCode: 200,
        message: '获取成功',
        data,
        total
      };
    } catch (err) {
      throw new HttpException({ status: false, statusCode: 500, message: '获取失败', data: err }, 500);
    }
  }

  /**
   * 朋友详情
   * @param query
   * @param req
   */
  async friendsDetail(query: FriendsDetailDeto): Promise<ReturnBody<FriendsListDetailInterFace>> {
    try {
      let result = await this.friendsRepository
        .createQueryBuilder('friend')
        .leftJoin('users', 'user', `user.id = ${query.user_id}`)
        .leftJoin('links', 'link', `friend.public_id = link.public_id`)
        .select([
          ...userBase,
          ...userOther,
          'user.create_at',
          ...friendBase,
          ...friendDetail,
          'friend.update_at',
          'friend.create_at',
          ...linkBase
        ])
        .where(`friend.id = ${query.friend_id}`)
        .getRawOne<FriendsListDetailRawInterFace>();

      let data = formatRawData<FriendsListDetailRawInterFace, FriendsListDetailInterFace>([result]);
      return { status: true, statusCode: 200, message: '获取成功', data: data[0] };
    } catch (err) {
      throw new HttpException({ status: false, statusCode: 500, message: '获取失败', data: err }, 500);
    }
  }
}
