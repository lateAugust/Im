import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Links } from '../events/links.emtity';
import { Users } from '../users/users.entity';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ comment: '申请人和创建人的id 降序 逗号隔开' })
  ids: string;

  @Column({ type: 'int', comment: '双方id, 降序 id(0)' })
  relation_id: number;

  @Column({ type: 'int', comment: '双方id, 降序 id(1)' })
  contact_id: number;

  @Column({ type: 'int', comment: '申请用户id' })
  apply_id: number;

  @Column({ type: 'int', comment: '创建人用户id(谁同意的)' })
  agree_id: number;

  @Column({ type: 'json', nullable: false, comment: '用户1基本信息' })
  relation_user: object;

  @Column({ type: 'json', nullable: false, comment: '用户2基本信息' })
  contact_user: object;

  @OneToMany(
    type => Users,
    user => user.friend
  )
  user: Users;

  @OneToMany(
    type => Links,
    link => link.friend
  )
  link: Links;

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
