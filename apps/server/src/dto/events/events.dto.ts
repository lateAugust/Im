import { IsNotEmpty, IsString, IsObject, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Timestamp } from 'typeorm';

class User {
  @IsInt({ message: 'id字段类型错误, 必须是个数字' })
  @IsNotEmpty({ message: '用户id是必须的' })
  id: number;

  @IsString({ message: 'username字段类型错误, 必须是个字符串' })
  @IsNotEmpty({ message: '用户名是必须的' })
  username: string;

  @IsString({ message: 'avatar字段类型错误, 必须是个字符串' })
  avatar?: string;

  @IsString({ message: 'nickname字段类型错误, 必须是个字符串' })
  nickname?: string;

  @IsEnum(['保密', '男', '女'], { message: '性别设置错误, 只能是保密, 男, 女三者之一' })
  @IsString({ message: 'gender字段类型错误, 必须是个字符串' })
  gender?: string;

  @IsInt({ message: 'age字段类型错误, 必须是个数字' })
  age?: number;
}

export class EventsMessageDto {
  @IsString({ message: 'message字段必须是字符串' })
  @IsNotEmpty({ message: '消息内容是必须的' })
  message: string;

  @IsInt({ message: 'send_id字段类型错误, 必须是数字类型' })
  @IsNotEmpty({ message: '发送方id是必须的' })
  send_id: number;

  @IsInt({ message: 'receive_id字段类型错误, 必须是数字类型' })
  @IsNotEmpty({ message: '接收方id是必须的' })
  receive_id: number;

  @IsInt({ message: 'links_id字段类型错误, 必须是数字类型' })
  links_id?: number;

  @IsInt({ message: 'message_id字段类型错误, 必须是数字类型' })
  message_id?: number;

  id?: number;

  update_at?: Timestamp;

  create_at?: Timestamp;
}
