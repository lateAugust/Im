import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersBaseDto, CreateUsersRegisterDto, SetUserInfoDto } from '../../dto/users/users.dto';
import { ReturnBody } from '../../utils/returnBody';
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
  async register({ username, password, pin_yin }: CreateUsersRegisterDto): Promise<ReturnBody<{}>> {
    try {
      let result = await this.usersRepository.save({ username, password, pin_yin });
      return { status: true, statusCode: 200, message: '注册成功', data: result };
    } catch (err) {
      let message = '';
      let statusCode = 400;
      switch (err.errno) {
        case 1062:
          message = '用户名已存在';
          break;
        case 1364:
          message = '缺少必填字段';
          break;
        default:
          message = '服务错误';
          statusCode = 500;
          break;
      }
      throw new HttpException({ data: err, statusCode, status: false, message }, statusCode);
    }
  }
  async login({ username, password }: CreateUsersBaseDto): Promise<ReturnBody<CreateUsersBaseDto | {}>> {
    let result = await this.usersRepository.findOne({ username, password });
    if (result) {
      Reflect.deleteProperty(result, 'password');
      let token = this.authService.certificate({ username: result.username, sub: result.id });
      return { status: true, statusCode: 200, message: '登录成功', data: result, token };
    }
    throw new HttpException({ statusCode: 400, status: false, message: '用户名或密码错误' }, 400);
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
      throw new HttpException({ statusCode: 403, status: false, message: '查无此人' }, 403);
    } catch (err) {
      throw new HttpException({ data: err, statusCode: 400, status: false, message: '获取信息失败, 请重试' }, 400);
    }
  }
  async setUserInfo(id: number, query: SetUserInfoDto): Promise<ReturnBody<Users | {}>> {
    try {
      let userData = await this.usersRepository.findOne({ id });
      let result = await this.usersRepository.save(Object.assign({}, userData, query));
      Reflect.deleteProperty(result, 'password');
      return { statusCode: 200, status: true, message: '修改成功', data: result };
    } catch (e) {
      let message = '修改失败, 请重试';
      if (e.errno === 1062) {
        message = '用户名已存在';
      }
      throw new HttpException({ statusCode: 400, status: false, message }, 400);
    }
  }
}
