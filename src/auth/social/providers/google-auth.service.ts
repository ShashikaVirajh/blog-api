import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { GenerateTokensProvider } from '../../providers/generate-tokents.provider';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();

      const user = await this.usersService.findOneByGoogleId(googleId);

      // If the user is already available, generate tokens with the user payload
      if (user) {
        return await this.generateTokensProvider.generateTokens(user);
      }

      // If the user is not available, create the Google user and then generate the tokens
      // const newUser = await this.usersService.createGoogleUser({
      //   email: email,
      //   firstName: firstName,
      //   lastName: lastName,
      //   googleId: googleId,
      // });
      //
      // return await this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
