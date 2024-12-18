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
import { GenerateTokensProvider } from './generate-tokents.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
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

      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      databaseTimeoutException(error);
    }
  }
}
