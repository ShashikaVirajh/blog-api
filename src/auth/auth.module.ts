import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { HashingService } from './providers/hashing.service';
import { BcryptService } from './providers/bcrypt.service';
import { SignInProvider } from './providers/sign-in.provider';

@Module({
  controllers: [AuthController],
  imports: [forwardRef(() => UsersModule)],
  providers: [
    AuthService,
    // When having abstract and implementation classes, do it as follows
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    SignInProvider,
  ],
  exports: [AuthService, HashingService],
})
export class AuthModule {}
