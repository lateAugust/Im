import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposers } from './proposers.emtity';
import { AuthModule } from 'libs/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Proposers]), AuthModule],
  providers: [FriendService],
  controllers: [FriendController]
})
export class FriendModule {}
