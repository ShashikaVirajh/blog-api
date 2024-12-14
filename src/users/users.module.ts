import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { profileConfig } from './config/profile.config';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { CreateManyUsersService } from './providers/create-many-users.service';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
  providers: [UsersService, CreateManyUsersService],
  exports: [UsersService],
})
export class UsersModule {}
