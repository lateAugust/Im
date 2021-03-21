import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Friends } from '../friends/friends.emtity';
import { Users } from '../users/users.entity';
import { PublicId } from '../common/index';
import { messageTypeEnum } from '../../common/enum/messages';

@Entity()
export class Links extends PublicId {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ type: 'int', comment: '存储通知类型的消息, 属于某个人的', default: null })
  belong_id: number;

  @Column({ type: 'int', comment: '发送方id' })
  send_id: number;

  @Column({ type: 'int', comment: '接收方id' })
  receive_id: number;

  @Column('enum', {
    enum: messageTypeEnum,
    comment: '消息类型',
    default: messageTypeEnum[0]
  })
  type: string;

  @Column({ comment: '消息类型对应的标题', default: null })
  title: string;

  @Column({ comment: '未读消息合计', default: 0 })
  unread_count: number;

  @Column({ comment: '消息内容' })
  message: string;

  @OneToMany(
    type => Users,
    user => user.link
  )
  user: Users;

  @OneToMany(
    type => Friends,
    friend => friend.link
  )
  friend: Friends;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}
