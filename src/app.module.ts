import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

/** Custom modules */
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    MetaOptionsModule,

    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [],
        autoLoadEntities: true, // Automatically load entities defined in feature modules and synchronize the database schema.
        synchronize: true,
        port: 5432,
        username: 'postgres',
        password: 'Postgres#12',
        host: 'localhost',
        database: 'blog',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
