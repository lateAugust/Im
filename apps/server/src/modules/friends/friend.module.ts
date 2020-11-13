import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposers } from '../../emtites/friends/proposers.emtity';
import { AuthModule } from 'libs/auth';
import { Users } from '../../emtites/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposers, Users]), AuthModule],
  providers: [FriendService],
  controllers: [FriendController]
})
export class FriendModule {}
