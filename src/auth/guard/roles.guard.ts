import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from 'src/generated/prisma/enums';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import type { JwtUser } from 'src/auth/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtUser }>();

    if (!request.user || !requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
