import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUsersRegisterDto } from './dto/users.dto';
import { ReturnBody } from '../utils/return-body';
import { UsersService } from './users.service';

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
}
