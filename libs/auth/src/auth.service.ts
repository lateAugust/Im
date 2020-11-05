import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BearTokenBaseValue } from '../types/bear-token';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  certificate(payload: BearTokenBaseValue): string {
    return this.jwtService.sign(payload);
  }
}
