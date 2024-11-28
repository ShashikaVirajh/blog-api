import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id')
  public getUsers(@Param() params: any, @Query() query: any): string {
    console.log('params', params);
    console.log('query', query);

    return 'Get Users Request';
  }

  @Post()
  public createUser(@Body() body: any): string {
    console.log('body', body);
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
