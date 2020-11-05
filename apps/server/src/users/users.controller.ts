import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersRegister } from '../types/users';
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
  @Post()
  async register(@Body() body: UsersRegister): Promise<ReturnBody<{}>> {
    return this.usersService.register(body);
  }
}
