import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendService } from './friend.service';
import { ApplyDto } from '../../dto/friends/friends.dto';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get()
  getHello(): string {
    return this.friendService.getHello();
  }
  @Post()
  createApply(@Body() apply: ApplyDto) {}
}
