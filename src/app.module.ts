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
import { ConfigModule, ConfigService } from '@nestjs/config';

// Get the current NODE_ENV
const CURRENT_ENVIRONMENT = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    MetaOptionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !CURRENT_ENVIRONMENT
        ? '.env'
        : `.env.${CURRENT_ENVIRONMENT}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // entities: [],

        synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        // Automatically load entities defined in feature modules and synchronize the database schema.
        autoLoadEntities: configService.get('DATABASE_AUTOLOAD_ENTITIES'),

        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        host: configService.get('DATABASE_HOST'),
        database: configService.get('DATABASE_NAME'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
