import { Body, Controller, Get, Post, Put, UseGuards, Request, Query, UsePipes, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { ApplyDto, FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { PagesDto } from '../../dto/common/pages.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReturnBody } from '../../utils/return-body';

import { Users } from '../../emtites/users/users.entity';
import { Proposers } from '../../emtites/friends/proposers.emtity';

import { RequestWidth } from 'types/express.extends';
import { ValidatePipe } from './friends.validate.pipe';

@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Get()
  @ApiOperation({ summary: '获取好友列表' })
  friendsList(): string {
    return this.friendsService.getHello();
  }
  @Get('/searching')
  @ApiOperation({ summary: '检索可添加的用户' })
  @ApiQuery({ name: 'keywords', description: '关键字' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'page_size', description: '页码数量', required: false })
  @UsePipes(new ValidatePipe())
  async searching(@Query() query: FriendsSearchingDto, @Request() req: RequestWidth): Promise<ReturnBody<Users | []>> {
    return this.friendsService.searching(query, req.user.sub);
  }
  @Post('/apply')
  @ApiOperation({ summary: '发送好友申请' })
  @UsePipes(new ValidatePipe())
  @HttpCode(200)
  createApply(@Body() apply: ApplyDto): Promise<ReturnBody<{}>> {
    return this.friendsService.createApply(apply);
  }
  @Get('/apply/list')
  @ApiOperation({ summary: '被申请的列表' })
  @UsePipes(new ValidatePipe())
  async applyList(@Query() query: PagesDto, @Request() req: RequestWidth): Promise<ReturnBody<Proposers | []>> {
    return this.friendsService.appliyList(query, req.user.sub);
  }
  @Put('/apply')
  @ApiOperation({ summary: '同意/拒绝申请' })
  auditApply() {}
}
