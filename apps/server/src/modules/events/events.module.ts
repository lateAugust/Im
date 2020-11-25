import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Links } from '../../emtites/events/links.emtity';
import { Messages } from '../../emtites/events/messages.emtity';

@Module({
  imports: [TypeOrmModule.forFeature([Links, Messages])],
  providers: [EventsGateway]
})
export class EventsModule {}
