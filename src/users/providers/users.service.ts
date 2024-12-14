import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import { profileConfig } from '../config/profile.config';
import { databaseTimeoutException } from '../../helpers/exceptions';
import { CreateManyUsersService } from './create-many-users.service';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    /** Injecting profile config */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    /** Injecting user repository */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    /** Inject many users service */
    private readonly createManyUsersService: CreateManyUsersService,
  ) {}

  /** Create user */
  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('The email already exists.');
      }

      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      databaseTimeoutException();
    }
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
}
