import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagesDto } from '../../dto/common/pages.dto';
import { ApplyDto, FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { Users } from '../../emtites/users/users.entity';
import { ReturnBody } from '../../utils/return-body';
import { pagination } from '../../utils/utils';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Proposers) private readonly proposersRepository: Repository<Proposers>,
    @InjectRepository(Users) private readonly usersRepositotry: Repository<Users>
  ) {}
  getHello(): string {
    return 'hello friend';
  }
  friendsList() {}
  async searching({ page, page_size, keywords }: FriendsSearchingDto, id: number): Promise<ReturnBody<Users | []>> {
    page = Number(page || 1);
    page_size = Number(page_size || 10);
    /* let sql = `SELECT DISTINCT users.id,users.username,users.nickname,users.mobile,users.gender,users.age,users.avatar,users.address
    FROM users LEFT JOIN friends
    ON users.id <> friends.relation_id
    WHERE users.id<>${id}
    AND (instr(users.username, '${keywords}') > 0 OR instr(users.mobile, '${keywords}') > 0)
    ORDER BY users.id LIMIT ${Math.max(0, page - 1) * page_size},${page_size}`; */
    let sql = `SELECT SQL_CALC_FOUND_ROWS id,username,nickname,gender,age,address,mobile,avatar,email,create_at FROM users`;
    if (keywords) {
      sql += ` WHERE (instr(users.username, '${keywords}') > 0 OR instr(users.mobile, '${keywords}') > 0) 
      ORDER BY users.id LIMIT ${Math.max(0, page - 1) * page_size},${page_size}`;
    }
    let result = await this.usersRepositotry.query(sql);
    let totalResult = await this.usersRepositotry.query('SELECT FOUND_ROWS()');
    let total = totalResult[0]['FOUND_ROWS()'] * 1;
    return { status: true, statusCode: 200, message: '获取成功', data: result, total, page, page_size };
  }
  async createApply(params: ApplyDto): Promise<ReturnBody<{}>> {
    try {
      if (params.proposers_id) {
        let data = await this.proposersRepository.findOne({ id: params.proposers_id });
        let result = await this.proposersRepository.save(Object.assign({}, data, { message: params.message }));
      } else {
        let targetUser = JSON.stringify(params.target_user);
        let applyUser = JSON.stringify(params.apply_user);
        let result = await this.proposersRepository.save(
          Object.assign({}, params, { target_user: targetUser, apply_user: applyUser })
        );
      }
      return { message: '添加成功', status: true, statusCode: 200, data: {} };
    } catch (e) {
      return { message: '添加失败', status: false, statusCode: 500, data: e };
    }
  }
  async appliyList({ page_size, page }: PagesDto, id: number): Promise<ReturnBody<Proposers | []>> {
    page = page || 1;
    page_size = page_size || 10;
    let sql =
      `SELECT SQL_CALC_FOUND_ROWS * FROM proposers 
    WHERE apply_id = ${id} AND 'status'<>'agreement' ORDER BY id LIMIT` + pagination(page, page_size);
    try {
      let result = await this.proposersRepository.query(sql);
      let totalResult = await this.usersRepositotry.query('SELECT FOUND_ROWS()');
      let total = totalResult[0]['FOUND_ROWS()'] * 1;
      return { status: true, statusCode: 200, message: '获取成功', data: result, total, page, page_size };
    } catch (err) {
      return { status: true, statusCode: 200, message: '获取成功', data: err };
    }
  }
}
