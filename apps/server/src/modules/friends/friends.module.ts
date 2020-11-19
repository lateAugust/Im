import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { AuthModule } from 'libs/auth';
import { Users } from '../../emtites/users/users.entity';
import { Friends } from '../../emtites/friends/friends.emtity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposers, Users, Friends]), AuthModule],
  providers: [FriendsService],
  controllers: [FriendsController]
})
export class FriendModule {}
