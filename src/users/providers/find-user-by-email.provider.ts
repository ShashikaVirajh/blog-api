import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string) {
    try {
      const user: User | undefined = await this.usersRepository.findOneBy({
        email: email,
      });

      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      return user;
    } catch (error) {
      databaseTimeoutException();
    }
  }
}
