import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'libs/auth';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Links]), AuthModule, MessageModule],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
