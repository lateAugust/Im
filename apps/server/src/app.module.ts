import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FriendModule } from './friend/friend.module';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';

@Module({
  imports: [DbModule, UsersModule, FriendModule, MessageModule],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService]
})
export class AppModule {}
