import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Proposers {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ comment: '要申请的用户id' })
  target_id: number;

  @Column({ comment: '申请方用户id' })
  apply_id: number;

  @Column({ length: 255, default: null, comment: '附加消息' })
  message: string;

  @Column({ length: 255, nullable: false, comment: '要申请添加的用户信息' })
  target_user: string;

  @Column({ length: 255, nullable: false, comment: '申请方的用户信息' })
  apply_user: string;

  @Column('enum', {
    enum: ['underReview', 'reject', 'agreement'],
    comment: '状态,underReview审核中,reject拒绝,agreement同意',
    default: 'underReview'
  })
  apply_status: string;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}