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
import { MailService } from '../../mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

      await this.mailService.sendUserWelcome(newUser);

      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      databaseTimeoutException();
    }
  }
}
