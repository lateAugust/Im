import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ unique: true, length: 10, comment: '用户名, 不可重复' })
  username: string;

  @Column({ length: 16, comment: '密码' })
  password: string;

  @Column({ length: 10, default: null, comment: '昵称' })
  nickname: string;

  @Column('enum', { enum: ['保密', '男', '女'], comment: '性别' })
  gender: string;

  @Column({ type: 'int', width: 3, default: null, comment: '年龄' })
  age: number;

  @Column({ length: 255, default: null, comment: '地址' })
  address: string;

  @Column({ length: 11, default: null, comment: '手机' })
  mobile: string;

  @Column({ length: 255, default: null, comment: 'e-mail' })
  email: string;

  @Column({ length: 255, default: null, comment: '头像地址' })
  avatar: string;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp'
  })
  update_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_at: Timestamp;
}