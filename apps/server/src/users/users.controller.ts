import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUsersRegisterDto, CreateUsersBaseDto } from './dto/users.dto';
import { ReturnBody } from '../utils/return-body';
import { UsersService } from './users.service';
import { Users } from './users.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }
  @Post('/register')
  @ApiOperation({ summary: '用户注册接口' })
  async register(@Body() body: CreateUsersRegisterDto): Promise<ReturnBody<{}>> {
    return this.usersService.register(body);
  }
  @Post('/login')
  @ApiOperation({ summary: '用户登录接口' })
  async login(@Body() body: CreateUsersBaseDto): Promise<ReturnBody<CreateUsersBaseDto | {}>> {
    return this.usersService.login(body);
  }
}
