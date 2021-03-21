import { Column } from 'typeorm';

export class PublicId {
  @Column({ comment: '双方的用户id, 以升序排序', default: null })
  public_id: string;
}
