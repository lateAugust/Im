import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Links } from '../../emtites/events/links.emtity';

@Module({
  imports: [TypeOrmModule.forFeature([Links])],
  providers: [EventsGateway]
})
export class EventsModule {}
