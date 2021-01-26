import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsUrl,
  IsMobilePhone,
  IsEmpty,
  IsObject,
  ValidateNested
} from 'class-validator';
import { PagesDto } from '../common/pages.dto';

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

  @ApiProperty({ required: true })
  @IsString({ message: 'pin_yin字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: 'pin_yin不能为空' })
  pin_yin: string;

  @ApiProperty({ required: false })
  @MaxLength(10, { message: '昵称长度不能大于10' })
  @MinLength(2, { message: '昵称长度不能小于2' })
  @IsString({ message: 'nickname字段类型错误, 只能是字符串' })
  nickname: string;

  @ApiProperty({ required: false })
  @IsEnum(['保密', '男', '女'], { message: '性别设置错误, 只能是保密, 男, 女三者之一' })
  @IsString({ message: 'gender字段类型错误, 只能是字符串' })
  gender: string;

  @ApiProperty({ required: false })
  @IsInt({ message: 'age类型错误, 只能是数字' })
  age: number;

  /* @ApiProperty({ required: false })
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
  email: string; */
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

  @ApiProperty({ required: false, type: User })
  @IsObject()
  @Type(() => User)
  target_user: User;

  @ApiProperty({ required: false, type: User })
  @IsObject()
  @Type(() => User)
  apply_user: User;

  @ApiProperty({ required: true, enum: ['underReview', 'reject', 'agreement'] })
  @IsEnum(['underReview', 'reject', 'agreement'], {
    message: '申请设置错误, 只能是underReview, reject, agreement三者之一'
  })
  @IsString({ message: 'apply_status字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '申请的状态不能为空' })
  apply_status: string;

  @IsString({ message: 'apply_status字段类型错误, 只能是字符串' })
  is_review: string; // 重新申请
}

export class FriendsSearchingDto extends PagesDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'keywords字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '手机、昵称不能为空' })
  keywords: string;
}

export class FriendsAuditDto {
  @ApiProperty({ required: true })
  @IsInt({ message: 'relation_id字段类型错误, 只能是数字' })
  @IsNotEmpty({ message: '申请方用户relation_id不能为空' })
  relation_id: number;

  @ApiProperty({ required: false, type: User })
  @IsObject()
  @Type(() => User)
  contact_user: User;

  @ApiProperty({ required: false, type: User })
  @IsObject()
  @Type(() => User)
  relation_user: User;

  @ApiProperty({ required: true })
  @IsInt({ message: 'contact_id字段类型错误, 只能是数字' })
  @IsNotEmpty({ message: '当前登录用户contact_id不能为空' })
  contact_id: number;

  @ApiProperty({ required: false })
  @IsInt({ message: '当前列表id必须是数字类型' })
  @IsNotEmpty({ message: '当前列表id不能为空' })
  proposers_id: number;

  @ApiProperty({ required: false })
  @IsString({ message: 'message字段类型错误, 只能是字符串' })
  message: string;

  @ApiProperty({ required: true, enum: ['reject', 'agreement'] })
  @IsEnum(['reject', 'agreement'], {
    message: '申请设置错误, 只能是reject, agreement二者之一'
  })
  @IsString({ message: 'apply_status字段类型错误, 只能是字符串' })
  @IsNotEmpty({ message: '申请的状态不能为空' })
  apply_status: string;
}

export class FriendsApplyListDto extends PagesDto {
  @IsEnum(['underReview', 'reject', 'agreement', ''], {
    message: '申请设置错误, 只能是underReview, reject, agreement和空, 默认underReview'
  })
  type: string;

  @IsString({ message: 'keywords字段类型错误, 只能是字符串' })
  keywords: string;
}

export class FriendsDetailDeto {
  // @IsInt({ message: 'friend_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'friend_id不能为空' })
  friend_id: string;

  // @IsInt({ message: 'user_id字段类型错误, 只能是number' })
  @IsNotEmpty({ message: 'user_id不能为空' })
  user_id: string;
}
