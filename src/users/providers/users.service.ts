import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import { profileConfig } from '../config/profile.config';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';
import { CreateManyUsersProvider } from './create-many-users.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {
  constructor(
    /** Injecting profile config */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    /** Injecting user repository */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    /** Inject user service */
    private readonly createUserService: CreateUserProvider,
    /** Inject many users service */
    private readonly createManyUsersService: CreateManyUsersProvider,
    /** Inject find user by email service */
    private readonly findUserByEmailService: FindUserByEmailProvider,
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
}
