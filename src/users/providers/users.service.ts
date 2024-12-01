import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
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

  public findOneById(id: number) {
    return {
      id: 12345,
      firstName: 'Jane',
      email: 'jane@gmail.com',
    };
  }
}
