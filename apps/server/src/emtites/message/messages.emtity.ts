import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { messageTypeEnum } from '../../common/enum/messages';
import { PublicId } from '../common/index';

@Entity()
export class Messages extends PublicId {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ comment: '消息内容' })
  message: string;

  @Column('enum', {
    enum: messageTypeEnum,
    comment: '消息类型',
    default: messageTypeEnum[0]
  })
  type: string;

  @Column({ comment: '发送方id' })
  send_id: number;

  @Column({ comment: '接收方id' })
  receive_id: number;

  @Column({ comment: '属于谁的id', default: null })
  belong_id: number;

  @Column({ comment: '申请列表id', default: null })
  proposers_id: number;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}
