import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoIdDto {
  @ApiProperty({ required: false })
  id: string;
}

export class CreateUsersBaseDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class CreateUsersRegisterDto extends CreateUsersBaseDto {
  @ApiProperty()
  confirm_password: string;
}

export class SetUserInfoDto {
  @ApiProperty({ required: false })
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
