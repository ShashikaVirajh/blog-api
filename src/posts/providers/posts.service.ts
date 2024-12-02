import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user,
        title: 'Post 1',
        content: 'Post 1 content',
      },
      {
        user,
        title: 'Post 2',
        content: 'Post 2 content',
      },
    ];
  }
}
