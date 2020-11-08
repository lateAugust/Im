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
