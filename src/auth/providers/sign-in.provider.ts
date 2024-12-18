import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { databaseTimeoutException } from '../../helpers/exceptions.helpers';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SignInProvider {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // Inject the hashingProvider
    private readonly hashingProvider: HashingProvider,
    // Inject jwt service
    private readonly jwtService: JwtService,
    // Inject jwt configuration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signIn(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneByEmail(signInDto.email);
      const isMatchedPassword = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );

      if (!isMatchedPassword) {
        throw new UnauthorizedException('Passwords do not match');
      }

      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        } as ActiveUserData,
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl,
        },
      );

      return {
        accessToken,
      };
    } catch (error) {
      databaseTimeoutException(error);
    }
  }
}
