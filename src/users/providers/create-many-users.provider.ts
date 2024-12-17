import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import {
  databaseTimeoutException,
  failedTransactionException,
} from '../../helpers/exceptions.helpers';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class CreateManyUsersProvider {
  constructor(private readonly dataSource: DataSource) {}

  /** Create many users */
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    // Initiate the connection
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      databaseTimeoutException();
    }

    try {
      for (const createUserDto of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, createUserDto);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      failedTransactionException(error);
    } finally {
      await queryRunner.release();
    }

    return {
      users: newUsers,
    };
  }
}
