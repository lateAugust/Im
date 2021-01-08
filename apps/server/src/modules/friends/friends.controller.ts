import { Body, Controller, Get, Post, Put, UseGuards, Request, Query, UsePipes, HttpCode, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { ApplyDto, FriendsAuditDto, FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { PagesDto } from '../../dto/common/pages.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReturnBody } from '../../utils/return-body';
import { FriendsSearchingListInterface } from '../../interface/friends.interface';

import { Users } from '../../emtites/users/users.entity';
import { Proposers } from '../../emtites/friends/proposers.emtity';

import { RequestWidth } from 'types/express.extends';
import { ValidatePipe } from './friends.validate.pipe';
import { Friends } from '../../emtites/friends/friends.emtity';

@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('friends')
@UsePipes(new ValidatePipe())
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Get('/searching')
  @ApiOperation({ summary: '检索可添加的用户' })
  @ApiQuery({ name: 'keywords', description: '关键字' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'page_size', description: '该页条数', required: false })
  async searching(
    @Query() query: FriendsSearchingDto,
    @Request() req: RequestWidth
  ): Promise<ReturnBody<FriendsSearchingListInterface[] | []>> {
    return this.friendsService.searching(query, req.user.sub);
  }
  @Post('/apply')
  @ApiOperation({ summary: '发送好友申请' })
  @HttpCode(200)
  createApply(@Body() apply: ApplyDto): Promise<ReturnBody<{}>> {
    return this.friendsService.createApply(apply);
  }
  @Get('/apply/list')
  @ApiOperation({ summary: '被申请的列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'page_size', description: '页码数量', required: false })
  async applyList(@Query() query: PagesDto, @Request() req: RequestWidth): Promise<ReturnBody<Proposers[] | []>> {
    return this.friendsService.appliyList(query, req.user.sub);
  }
  @Put('/apply/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '同意/拒绝申请' })
  async auditApply(@Body() query: FriendsAuditDto, @Param() id: string): Promise<ReturnBody<{}>> {
    return this.friendsService.auditApply(query, id);
  }

  @Get('/list')
  @ApiOperation({ summary: '朋友列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'page_size', description: '页码数量', required: false })
  async friendsList(@Query() query: PagesDto, @Request() req: RequestWidth): Promise<ReturnBody<Friends[] | []>> {
    return this.friendsService.friendsList(query, req.user.sub);
  }
}
