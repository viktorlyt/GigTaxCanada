import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/jwt-payload';

type RequestWithUser = {
  user: JwtPayload;
};

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | string => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (key === undefined) {
      return user;
    }

    return user[key];
  },
);
