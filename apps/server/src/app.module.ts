import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FriendModule } from './friend/friend.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [DbModule, UsersModule, FriendModule, MessageModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
