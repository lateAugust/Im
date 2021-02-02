import { IsNotEmpty } from 'class-validator';
import { PagesDto } from '../common/pages.dto';

export class MessageListDeto extends PagesDto {
  // @IsInt({ message: 'friend_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'send_id不能为空' })
  send_id: string;

  // @IsInt({ message: 'user_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'receive_id不能为空' })
  receive_id: string;

  message_id?: number;
}
