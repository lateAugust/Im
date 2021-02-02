import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';
import { AuthModule } from 'libs/auth';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Links, Messages]), AuthModule],
  providers: [EventsGateway],
  controllers: [],
  exports: [EventsGateway]
})
export class EventsModule {}
