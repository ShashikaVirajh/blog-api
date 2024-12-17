import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    // Inject user repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // Inject hashing service
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingService: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('The email already exists.');
      }

      const hashedPassword = await this.hashingService.hashPassword(
        createUserDto.password,
      );

      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      databaseTimeoutException();
    }
  }
}
