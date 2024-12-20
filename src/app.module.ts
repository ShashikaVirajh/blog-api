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
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { envSchema } from './config/env.schema';
import { PaginationModule } from './common/pagination/pagination.module';
import { jwtConfig } from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';

// Get the current NODE_ENV
const CURRENT_ENVIRONMENT = process.env.NODE_ENV;

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
    UploadsModule,
    MailModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
      validate: envSchema.parse,
      envFilePath: !CURRENT_ENVIRONMENT
        ? '.env'
        : `.env.${CURRENT_ENVIRONMENT}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',

          // Automatically syncs the database schema with entity definitions.
          synchronize: configService.get('database.synchronize'),
          // Automatically loads all registered entities across modules.
          autoLoadEntities: configService.get('database.autoLoadEntities'),

          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          host: configService.get('database.host'),
          database: configService.get('database.name'),
        };
      },
    }),
  ],
})
export class AppModule {}
