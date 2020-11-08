import { Request } from 'express';
import { BearTokenValue } from '../libs/auth/types/bear-token';

export interface RequestWidth extends Request {
  user: BearTokenValue;
}
