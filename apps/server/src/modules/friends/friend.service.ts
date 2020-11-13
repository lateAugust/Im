import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { Users } from '../../emtites/users/users.entity';
import { ReturnBody } from '../../utils/return-body';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Proposers) private readonly proposersRepository: Repository<Proposers>,
    @InjectRepository(Users) private readonly usersRepositotry: Repository<Users>
  ) {}
  getHello(): string {
    return 'hello friend';
  }
  friendsList() {}
  async searching({ page, page_size, keywords }: FriendsSearchingDto, id: number): Promise<ReturnBody<Users | []>> {
    page = Number(page);
    page_size = Number(page_size);
    if (!keywords) {
      return { status: false, statusCode: 400, message: '关键词是必须的', data: [] };
    }
    /* let sql = `SELECT DISTINCT users.id,users.username,users.nickname,users.mobile,users.gender,users.age,users.avatar,users.address
    FROM users LEFT JOIN friends
    ON users.id <> friends.relation_id
    WHERE users.id<>${id}
    AND (instr(users.username, '${keywords}') > 0 OR instr(users.mobile, '${keywords}') > 0)
    ORDER BY users.id LIMIT ${Math.max(0, page - 1) * page_size},${page_size}`; */
    let sql = `SELECT SQL_CALC_FOUND_ROWS id,username,nickname,gender,age,address,mobile,avatar,email,create_at
      FROM users 
      WHERE (instr(users.username, '${keywords}') > 0 OR instr(users.mobile, '${keywords}') > 0) 
      ORDER BY users.id LIMIT ${Math.max(0, page - 1) * page_size},${page_size}`;
    let result = await this.usersRepositotry.query(sql);
    let totalResult = await this.usersRepositotry.query('SELECT FOUND_ROWS()');
    let total = totalResult[0]['FOUND_ROWS()'] * 1;
    return { status: true, statusCode: 200, message: '获取成功', data: result, total, page, page_size };
  }
}
