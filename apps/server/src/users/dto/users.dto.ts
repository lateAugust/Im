import { ApiProperty } from '@nestjs/swagger';

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
