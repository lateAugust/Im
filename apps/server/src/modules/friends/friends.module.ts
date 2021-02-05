import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { AuthModule } from 'libs/auth';
import { Users } from '../../emtites/users/users.entity';
import { Friends } from '../../emtites/friends/friends.emtity';
import { EventsModule } from '../events/events.module';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposers, Users, Friends, Links, Messages]), AuthModule, EventsModule],
  providers: [FriendsService],
  controllers: [FriendsController]
})
export class FriendModule {}
