import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
