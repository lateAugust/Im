import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsUrl,
  IsMobilePhone
} from 'class-validator';

class User {
  @ApiProperty({ required: true })
  @IsInt({ message: '用户id必须是数字类型' })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: number;

  @ApiProperty({ required: true })
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
  avatar: number;

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

export class ApplyDto {
  @ApiProperty({ required: false })
  @IsInt({ message: '用户proposers_id必须是数字类型' })
  proposers_id: number;

  @ApiProperty({ required: false })
  @IsString({ message: 'message字段类型错误, 只能是字符串' })
  message: string;

  @ApiProperty({ required: true })
  @IsInt({ message: '申请用户apply_id必须是数字类型' })
  @IsNotEmpty({ message: '申请用户apply_id不能为空' })
  apply_id: number;

  @ApiProperty({ required: true })
  @IsInt({ message: '添加目标用户target_id必须是数字类型' })
  @IsNotEmpty({ message: '添加目标用户target_id不能为空' })
  target_id: number;

  @ApiProperty({ required: true })
  target_user: User;

  @ApiProperty({ required: true })
  apply_user: User;

  @ApiProperty({ required: true, enum: ['underReview', 'reject', 'agreement'] })
  @IsEnum(['underReview', 'reject', 'agreement'], {
    message: '申请设置错误, 只能是underReview, reject, agreement三者之一'
  })
  @IsString({ message: 'apply_status字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '申请的状态不能为空' })
  apply_status: string;
}

export class FriendsSearchingDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'keywords字段类型错误, 只能是字符串' })
  keywords: string;

  @ApiProperty({ required: false, default: 1 })
  page: number;

  @ApiProperty({ required: false, default: 10 })
  page_size: number;
}
