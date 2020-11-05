import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FriendModule } from './friend/friend.module';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { AuthModule } from 'libs/auth';

@Module({
  imports: [DbModule, UsersModule, FriendModule, MessageModule, AuthModule],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService]
})
export class AppModule {}
