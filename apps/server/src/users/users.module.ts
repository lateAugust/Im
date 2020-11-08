import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'libs/auth';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
