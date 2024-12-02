import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

/** Custom modules */
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
