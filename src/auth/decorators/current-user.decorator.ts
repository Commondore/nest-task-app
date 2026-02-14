import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type JwtUser = { userId: number };
type RequestWithUser = Request & { user?: JwtUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user as JwtUser;
  },
);
