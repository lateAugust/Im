import { ApiProperty } from '@nestjs/swagger';
import { Min, Max, IsEnum, IsString, IsInt, IsEmail, IsUrl, IsMobilePhone } from 'class-validator';

export class GetUserInfoIdDto {
  @ApiProperty({ required: false })
  id: string;
}

export class CreateUsersBaseDto {
  @ApiProperty()
  @IsString({ message: 'username字段类型错误, 只能是字符串' })
  @Min(2, { message: '用户名长度不能小于2' })
  @Max(10, { message: '用户名长度不能大于10' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'password字段类型错误, 只能是字符串' })
  @Min(6, { message: '密码长度不能小于6' })
  @Max(16, { message: '密码长度不能大于16' })
  password: string;
}

export class CreateUsersRegisterDto extends CreateUsersBaseDto {
  @ApiProperty()
  @IsString({ message: 'confirm_password字段类型错误, 只能是字符串' })
  @Min(6, { message: '确认密码长度不能小于6' })
  @Max(16, { message: '确认密码长度不能大于16' })
  confirm_password: string;
}

export class SetUserInfoDto {
  @ApiProperty({ required: false })
  @Min(2, { message: '用户名长度不能小于2' })
  @Max(10, { message: '用户名长度不能大于10' })
  @IsString({ message: 'username字段类型错误, 只能是字符串' })
  username: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'nickname字段类型错误, 只能是字符串' })
  @Max(10, { message: '昵称长度不能大于10' })
  nickname: string;

  @IsString({ message: 'gender字段类型错误, 只能是字符串' })
  @ApiProperty({ required: false })
  @IsEnum(['保密', '男', '女'], { message: '性别设置错误, 只能是保密, 男, 女三者之一' })
  gender: string;

  @ApiProperty({ required: false })
  @IsInt({ message: 'age类型错误, 只能是数字' })
  age: number;

  @ApiProperty({ required: false })
  @IsUrl(null, { message: 'avatar不合法' })
  avatar: string;

  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'mobile字段类型错误, 只能是字符串' })
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号不合法' })
  mobile: string;

  @IsEmail(null, { message: 'email不合法' })
  @ApiProperty({ required: false })
  email: string;
}
