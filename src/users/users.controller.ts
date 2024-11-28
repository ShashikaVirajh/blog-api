import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers(): string {
    return 'Get Users Request';
  }

  @Post()
  public createUser(): string {
    return 'Create User Request';
  }

  @Patch()
  public patchUser(): string {
    return 'Patch User Request';
  }

  @Put()
  public UpdateUser(): string {
    return 'Update User Request';
  }

  @Delete()
  public deleteUser(): string {
    return 'Delete User Request';
  }
}
