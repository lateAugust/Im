import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersBaseDto, CreateUsersRegisterDto, SetUserInfoDto } from '../../dto/users/users.dto';
import { ReturnBody } from '../../utils/return-body';
import { Users } from '../../emtites/users/users.entity';
import { AuthService } from 'libs/auth';
import { RequestWidth } from 'types/express.extends';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    private readonly authService: AuthService
  ) {}
  getHello(): string {
    return 'hello users';
  }
  async register({ username, password }: CreateUsersRegisterDto): Promise<ReturnBody<{}>> {
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
  async login({ username, password }: CreateUsersBaseDto): Promise<ReturnBody<CreateUsersBaseDto | {}>> {
    let validate = [
      { value: username, key: '用户名' },
      { value: password, key: '密码' }
    ];
    for (let item of validate) {
      if (!item.value) {
        return { status: false, statusCode: 400, message: item.key + '是必须的', data: {} };
      }
    }
    try {
      let result = await this.usersRepository.findOne({ username, password });
      if (result) {
        Reflect.deleteProperty(result, 'password');
        let token = this.authService.certificate({ username: result.username, sub: result.id });
        return { status: true, statusCode: 200, message: '登录成功', data: result, token };
      }
      return { status: false, statusCode: 400, message: '用户名或密码错误', data: {} };
    } catch (error) {
      return { status: true, statusCode: 400, message: '登录失败', data: {} };
    }
  }
  async getUserInfo(id: number, req: RequestWidth): Promise<ReturnBody<Users | {}>> {
    id = id || req.user.sub;
    try {
      let result = await this.usersRepository.findOne({ id });
      if (result) {
        Reflect.deleteProperty(result, 'password');
        Reflect.deleteProperty(result, 'update_at');
        return { statusCode: 200, status: true, message: '获取成功', data: result };
      }
      return { statusCode: 403, status: false, message: '查无此人', data: {} };
    } catch (err) {
      return { statusCode: 400, status: false, message: '查找失败, 请重试', data: {} };
    }
  }
  async setUserInfo(id: number, query: SetUserInfoDto): Promise<ReturnBody<Users | {}>> {
    try {
      let userData = await this.usersRepository.findOne({ id });
      let result = await this.usersRepository.save(Object.assign({}, userData, query));
      Reflect.deleteProperty(result, 'password');
      return { statusCode: 200, status: true, message: '修改成功', data: result };
    } catch (e) {
      let message = '修改失败';
      if (e.errno === 1062) {
        message = '用户名已存在';
      }
      return { statusCode: 400, status: false, message, data: {} };
    }
  }
}
