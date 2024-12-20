import { Body, Controller, Post } from '@nestjs/common';

import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { GoogleAuthService } from './providers/google-auth.service';

@Controller('auth/google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  @Auth(AuthType.NoAuth)
  authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(googleTokenDto);
  }
}
