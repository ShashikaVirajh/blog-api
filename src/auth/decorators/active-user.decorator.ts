import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (_, ctx: ExecutionContext): ActiveUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request[REQUEST_USER_KEY];
  },
);
