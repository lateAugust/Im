import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Links {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ length: '11', comment: '双方的id, 升序, 中间逗号隔开' })
  ids: string;

  @Column({ type: 'json', nullable: false, comment: '发送方的信息' })
  user: number;

  @Column({ type: 'json', nullable: false, comment: '接收方的信息' })
  receive: number;

  @Column({ comment: '未读消息合计' })
  unread_count: number;

  @Column({ comment: '消息内容' })
  message: string;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}
