import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FriendModule } from './modules/friends/friends.module';
import { MessageModule } from './modules/message/message.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './modules//events/events.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, UsersModule, FriendModule, MessageModule, EventsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
