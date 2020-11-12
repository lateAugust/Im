import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FriendModule } from './modules/friends/friend.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [DbModule, UsersModule, FriendModule, MessageModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
