import { Body, Controller, Get, Param, Post, UseGuards, Request, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUsersRegisterDto, CreateUsersBaseDto, GetUserInfoIdDto, SetUserInfoDto } from './dto/users.dto';
import { ReturnBody } from '../utils/return-body';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { RequestWidth } from 'types/express.extends';

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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/info/:id?')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserInfo(@Param('id') id: GetUserInfoIdDto, @Request() req: RequestWidth): Promise<ReturnBody<Users | {}>> {
    return this.usersService.getUserInfo(Number(id), req);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/info')
  @ApiOperation({ summary: '修改用户信息' })
  async setUserInfo(@Request() req: RequestWidth, @Query() query: SetUserInfoDto): Promise<ReturnBody<Users | {}>> {
    return this.usersService.setUserInfo(Number(req.user.sub), query);
  }
}
