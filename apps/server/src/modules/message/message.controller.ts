import { Controller, Get, Query, UseGuards, UsePipes, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageListDto } from '../../dto/message/message.dto';
import { Messages } from '../../emtites/message/messages.emtity';
import { MessageService } from './message.service';
import { LinksList } from '../../common/interface/message/message.interface';

import { ReturnBody } from '../../utils/returnBody';
import { AuthGuard } from '@nestjs/passport';
import { ValidatePipe } from './message.validate.pipe';
import { PagesDto } from '../../dto/common/pages.dto';
import { Links } from '../../emtites/message/links.emtity';
import { RequestWidth } from 'types/express.extends';

@ApiTags('message')
@Controller('message')
@ApiBearerAuth()
@UsePipes(new ValidatePipe())
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get()
  getHello(): string {
    return this.messageService.getHello();
  }
  @Get('/list')
  async getMessageList(@Query() query: MessageListDto, @Request() req: RequestWidth): Promise<ReturnBody<Messages[]>> {
    return this.messageService.getMessageList(query, req.user.sub);
  }
  @Get('/links')
  async getLinks(@Query() query: PagesDto, @Request() req: RequestWidth): Promise<ReturnBody<LinksList[]>> {
    return this.messageService.getLinks(query, req.user.sub);
  }
}
