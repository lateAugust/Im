import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.168.208.128',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities,
      synchronize: true
    })
  ],
  providers: [DbService],
  exports: [DbService]
})
export class DbModule {}
