import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { dataType } from '../../utils/utils';

// 注意验证装饰器的书写顺序 (执行顺序, 由上往下, 则相应的提示变为由下往上)
// MinLength -> MaxLength -> IsString -> IsNotEmpty

const isNotValidateProp = ['nickname', 'gender', 'age', 'avatar', 'address', 'mobile', 'IsEmail', 'message'];

@Injectable()
export class ValidatePipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    let errors = await validate(object);
    let eachObjectKey = this.eachObjectKey(object);
    for (let key of eachObjectKey) {
      let error = await validate(object[key]);
      errors.push(...error);
    }
    this.returnErrorMessage(errors);
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private eachObjectKey(object: Object): string[] {
    let array: string[] = [];
    for (const key in object) {
      if (dataType(object[key]) === 'object') {
        array.push(key);
      }
    }
    return array;
  }
  private returnErrorMessage(errors: ValidationError[]): any {
    for (let { property, constraints, value } of errors) {
      if (!isNotValidateProp.includes(property) || value !== undefined) {
        throw new BadRequestException(Object.values(constraints)[0]);
      }
    }
  }
}

// x = y/(8/21.75 +1)
