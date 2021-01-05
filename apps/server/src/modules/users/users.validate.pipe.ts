import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { propEmpty } from '../../utils/utils';

// 注意验证装饰器的书写顺序 (执行顺序, 由上往下, 则相应的提示变为由下往上)
// MinLength -> MaxLength -> IsString -> IsNotEmpty

@Injectable()
export class ValidatePipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    this.returnErrorMessage(errors);
    if (value.password && value.confirm_password && value.password !== value.confirm_password) {
      throw new BadRequestException('两次密码不一致');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private returnErrorMessage(errors: ValidationError[]): any {
    for (let { constraints, value } of errors) {
      if (constraints.isNotEmpty || propEmpty(value)) {
        throw new BadRequestException(Object.values(constraints)[0]);
      }
    }
  }
}
