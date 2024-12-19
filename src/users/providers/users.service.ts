import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';
import { CreateManyUsersProvider } from './create-many-users.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { GoogleUser } from '../interfaces/google-user.inerface';

import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindUserByGoogleIdProvider } from './find-user-by-google-id.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly createUserService: CreateUserProvider,
    private readonly createManyUsersService: CreateManyUsersProvider,
    private readonly findUserByEmailService: FindUserByEmailProvider,
    private readonly findUserByGoogleIdProvider: FindUserByGoogleIdProvider,
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  /** Create user */
  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserService.createUser(createUserDto);
  }

  /** Find all user */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@gmail.com',
      },
      {
        firstName: 'Jane',
        email: 'jane@gmail.com',
      },
    ];
  }

  /** Find a user by id */
  public async findOneById(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({
        id,
      });

      if (!user) {
        throw new BadRequestException('The userId does not exist');
      }

      return user;
    } catch (error) {
      databaseTimeoutException();
    }
  }

  /** Create many users */
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.createManyUsersService.createMany(createManyUsersDto);
  }

  /** Finds one user by email */
  public async findOneByEmail(email: string) {
    return await this.findUserByEmailService.findOneByEmail(email);
  }

  /** Create google user */
  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

  /** Find user by googleId */
  public async findOneByGoogleId(googleId: string) {
    return await this.findUserByGoogleIdProvider.findOneByGoogleId(googleId);
  }
}
