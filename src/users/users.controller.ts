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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id?')
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto): string {
    console.log('createUserDto:', createUserDto);
    return 'Create User Request';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto): string {
    console.log('patchUserDto:', patchUserDto);
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
