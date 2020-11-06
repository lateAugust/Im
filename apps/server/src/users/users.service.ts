import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersRegisterDto } from './dto/users.dto';
import { ReturnBody } from '../utils/return-body';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}
  getHello(): string {
    return 'hello users';
  }
  async register({ username, password, confirm_password }: CreateUsersRegisterDto): Promise<ReturnBody<{}>> {
    let validate = [
      { value: username, key: '用户名' },
      { value: password, key: '密码' },
      { value: confirm_password, key: '确认密码' }
    ];
    for (let item of validate) {
      if (!item.value) {
        return { status: false, statusCode: 400, message: item.key + '是必须的', data: {} };
      }
    }
    if (confirm_password !== password) {
      return { status: false, statusCode: 400, message: '两次密码不一致', data: {} };
    }
    try {
      let result = await this.usersRepository.save({ username, password });
      return { status: false, statusCode: 200, message: '注册成功', data: result };
    } catch (e) {
      let message = '';
      switch (e.errno) {
        case 1062:
          message = '用户名已存在';
          break;
        case 1364:
          message = '缺少必填字段';
          break;
        default:
          message = '未知错误';
          break;
      }
      return { status: false, statusCode: 400, message, data: {} };
    }
  }
}
