import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ comment: '消息内容' })
  message: string;

  @Column('enum', { enum: ['notification', 'message'], comment: '消息类型', default: 'message' })
  type: string;

  @Column({ comment: '发送方id' })
  send_id: number;

  @Column({ comment: '接收方id' })
  receive_id: number;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}
