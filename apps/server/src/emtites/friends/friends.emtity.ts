import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ type: 'int', comment: '创建人的id(谁同意的)' })
  relation_id: number;

  @Column({ type: 'int', comment: '申请人的id' })
  target_id: number;

  @Column({ type: 'json', nullable: false, comment: '申请人的信息' })
  target_user: object;

  @Column({ type: 'json', nullable: false, comment: '创建人的信息' })
  relation_user: object;

  @OneToMany(
    type => Users,
    user => user.friend
  )
  user: Users;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
    comment: '更新时间'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp', comment: '创建时间' })
  create_at: Timestamp;
}
