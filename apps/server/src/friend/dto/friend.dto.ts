import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({ required: true })
  id: number;
  @ApiProperty({ required: true })
  username: string;
  @ApiProperty({ required: false })
  nickname: string;
  @ApiProperty({ required: false })
  gender: string;
  @ApiProperty({ required: false })
  age: number;
  @ApiProperty({ required: false })
  avatar: number;
  @ApiProperty({ required: false })
  address: string;
  @ApiProperty({ required: false })
  mobile: string;
  @ApiProperty({ required: false })
  email: string;
}

export class ApplyDto {
  @ApiProperty({ required: false })
  proposers_id: number;
  @ApiProperty({ required: false })
  message: string;
  @ApiProperty({ required: true })
  apply_id: number;
  @ApiProperty({ required: true })
  target_id: number;
  @ApiProperty({ required: true })
  target_user: User;
  @ApiProperty({ required: true })
  apply_user: User;
  @ApiProperty({ required: true, enum: ['underReview', 'reject', 'agreement'] })
  apply_status: string;
}
