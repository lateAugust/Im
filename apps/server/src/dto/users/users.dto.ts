import { ApiProperty } from '@nestjs/swagger';
import {
  Min,
  Max,
  IsEnum,
  IsString,
  IsInt,
  IsEmail,
  IsUrl,
  IsMobilePhone,
  MinLength,
  MaxLength,
  IsNotEmpty
} from 'class-validator';

export class GetUserInfoIdDto {
  @ApiProperty({ required: false })
  id: string;
}

export class CreateUsersBaseDto {
  @ApiProperty()
  @MinLength(2, { message: '用户名长度不能小于2' })
  @MaxLength(10, { message: '用户名长度不能大于10' })
  @IsString({ message: 'username字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty()
  @MinLength(6, { message: '密码长度不能小于6' })
  @MaxLength(16, { message: '密码长度不能大于16' })
  @IsString({ message: 'password字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class CreateUsersRegisterDto extends CreateUsersBaseDto {
  @ApiProperty()
  @MinLength(6, { message: '确认密码长度不能小于6' })
  @MaxLength(16, { message: '确认密码长度不能大于16' })
  @IsString({ message: 'confirm_password字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirm_password: string;
}

export class SetUserInfoDto {
  @ApiProperty({ required: false })
  @MinLength(2, { message: '用户名长度不能小于2' })
  @MaxLength(10, { message: '用户名长度不能大于10' })
  @IsString({ message: 'username字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ required: false })
  @MinLength(2, { message: '昵称长度不能小于2' })
  @MaxLength(10, { message: '昵称长度不能大于10' })
  @IsString({ message: 'nickname字段类型错误, 只能是字符串' })
  nickname: string;

  @ApiProperty({ required: false })
  @IsEnum(['保密', '男', '女'], { message: '性别设置错误, 只能是保密, 男, 女三者之一' })
  @IsString({ message: 'gender字段类型错误, 只能是字符串' })
  gender: string;

  @ApiProperty({ required: false })
  @IsInt({ message: 'age类型错误, 只能是数字' })
  age: number;

  @ApiProperty({ required: false })
  @IsUrl(null, { message: 'avatar不合法' })
  @IsString({ message: 'avatar字段类型错误, 只能是字符串' })
  avatar: string;

  @ApiProperty({ required: false })
  @IsString({ message: 'address字段类型错误, 只能是字符串' })
  address: string;

  @ApiProperty({ required: false })
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号不合法' })
  @IsString({ message: 'mobile字段类型错误, 只能是字符串' })
  mobile: string;

  @ApiProperty({ required: false })
  @IsEmail(null, { message: 'email不合法' })
  @IsString({ message: 'email字段类型错误, 只能是字符串' })
  email: string;
}
