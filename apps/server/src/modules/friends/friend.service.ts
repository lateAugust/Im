import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposers } from '../../emtites/friends/proposers.emtity';

@Injectable()
export class FriendService {
  constructor(@InjectRepository(Proposers) private readonly proposersRepository: Repository<Proposers>) {}
  getHello(): string {
    return 'hello friend';
  }
}
