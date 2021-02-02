import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageListDeto } from '../../dto/message/message.dto';
import { Messages } from '../../emtites/events/messages.emtity';
import { MessageService } from './message.service';

import { ReturnBody } from '../../utils/return-body';
import { AuthGuard } from '@nestjs/passport';
import { ValidatePipe } from './message.validate.pipe';

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
  async getMessageList(@Query() query: MessageListDeto): Promise<ReturnBody<Messages[]>> {
    return this.messageService.getMessageList(query);
  }
}
