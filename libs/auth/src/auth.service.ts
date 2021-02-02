import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BearTokenBaseValue, BearTokenExp, BearTokenValue } from '../types/bear-token';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  certificate(payload: BearTokenBaseValue): string {
    return this.jwtService.sign(payload);
  }
  decode(token: string) {
    return this.jwtService.decode(token);
  }

  verify(token: string) {
    let user: BearTokenValue;
    try {
      user = this.jwtService.verify<BearTokenValue>(token, { secret: process.env.TOKEN_SECRET_KEY });
    } catch (err) {
      // user = { isExp: false };
    }
    return user;
  }
}
