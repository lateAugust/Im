import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class PagesDto {
  @ApiProperty({ required: false, default: 1 })
  // @IsInt({ message: 'page字段类型错误, 只能是数字类型' })
  page: number;

  @ApiProperty({ required: false, default: 10 })
  // @IsInt({ message: 'page_size字段类型错误, 只能是数字类型' })
  page_size: number;
}
