import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { profileConfig } from './config/profile.config';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { CreateManyUsersProvider } from './providers/create-many-users.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { AuthModule } from '../auth/auth.module';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { FindUserByGoogleIdProvider } from './providers/find-user-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateManyUsersProvider,
    CreateUserProvider,
    FindUserByEmailProvider,
    FindUserByGoogleIdProvider,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
