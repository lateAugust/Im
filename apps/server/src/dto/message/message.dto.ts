import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { PagesDto } from '../common/pages.dto';

export class MessageListDto extends PagesDto {
  // @IsInt({ message: 'friend_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'send_id不能为空' })
  send_id: number;

  // @IsInt({ message: 'user_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'receive_id不能为空' })
  receive_id: number;

  message_id?: number;

  @IsEnum(['Message', 'NewFriendNotification'], {
    message: 'type值错误, 只能是message,notification二者之一, 默认message'
  })
  @IsString({ message: 'type类型错误, 只能是字符串' })
  type?: string; // 消息类型
}
