import { Body, Controller, Get, Post, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FriendService } from './friend.service';
import { ApplyDto, FriendsSearchingDto } from '../../dto/friends/friends.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReturnBody } from '../../utils/return-body';
import { Users } from '../../emtites/users/users.entity';
import { RequestWidth } from 'types/express.extends';

@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get()
  @ApiOperation({ summary: '获取好友列表' })
  friendsList(): string {
    return this.friendService.getHello();
  }
  @Get('/seaching')
  @ApiOperation({ summary: '检索可添加的用户' })
  @ApiQuery({ name: 'keywords', description: '关键字' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'page_size', description: '页码数量', required: false })
  async searching(@Query() query: FriendsSearchingDto, @Request() req: RequestWidth): Promise<ReturnBody<Users | []>> {
    return this.friendService.searching(query, req.user.sub);
  }
  @Post('/apply')
  @ApiOperation({ summary: '发送好友申请' })
  createApply(@Body() apply: ApplyDto) {}
  @Put('/apply')
  @ApiOperation({ summary: '同意/拒绝申请' })
  auditApply() {}
}
