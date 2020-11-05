import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRegister } from '../types/users';
import { ReturnBody } from '../utils/return-body';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}
  getHello(): string {
    return 'hello users';
  }
  async register({ username, password, confirm_password }: UsersRegister): Promise<ReturnBody<{}>> {
    let validate = [
      { value: password, key: 'password' },
      { value: username, key: 'username' },
      { value: confirm_password, key: 'confirm_password' }
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
      return { status: false, statusCode: 200, message: '注册成功', data: {} };
    } catch (e) {
      if (e.errno === 1062) {
        return { status: false, statusCode: 400, message: '用户名已存在', data: {} };
      }
    }
  }
}
