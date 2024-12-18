import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<AuthType, CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.BearerToken]: [this.accessTokenGuard],
      [AuthType.NoAuth]: [{ canActivate: () => Promise.resolve(true) }],
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthType.BearerToken];

    const guards = authTypes.flatMap(
      (type) => this.authTypeGuardMap[type] || [],
    );

    let authError = new UnauthorizedException();

    for (const guard of guards) {
      try {
        const canActivate = await guard.canActivate(context);

        if (canActivate) {
          return true;
        }
      } catch (error) {
        authError = error;
      }
    }

    throw authError;
  }
}
