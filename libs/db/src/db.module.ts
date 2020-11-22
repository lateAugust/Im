import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities';
import { ConfigModule } from '@nestjs/config';
const env = process.env;
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DATABASE_HOST,
      port: Number(env.DATAABASE_PORT),
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_DATABASE,
      entities,
      synchronize: true
    })
  ],
  providers: [DbService],
  exports: [DbService]
})
export class DbModule {}
