import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';

@Controller('users')
export class UsersController {
  @Get('/:id?')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): string {
    console.log('id:', id);
    console.log('limit:', limit);
    console.log('page', page);

    return 'Get Users Request';
  }

  @Post()
  public createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): string {
    console.log('createUserDto:', createUserDto);
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
