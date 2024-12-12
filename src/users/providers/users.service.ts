import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    // Injecting config service
    private readonly configService: ConfigService,
    // Injecting user repository
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
    });

    let createdUser = this.usersRepository.create(createUserDto);
    createdUser = await this.usersRepository.save(createdUser);
    return createdUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const environment = this.configService.get<string>('S3_BUCKET_NAME');
    console.log(environment);

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

  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
