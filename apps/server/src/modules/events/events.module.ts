import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Links } from '../../emtites/message/links.emtity';
import { Messages } from '../../emtites/message/messages.emtity';
import { AuthModule } from 'libs/auth';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Links, Messages]), AuthModule],
  providers: [EventsGateway],
  controllers: [],
  exports: [EventsGateway]
})
export class EventsModule {}
