import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

/** Custom modules */
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
