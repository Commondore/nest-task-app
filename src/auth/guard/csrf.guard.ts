import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (SAFE_METHODS.includes(request.method)) {
      return true;
    }

    const csrfCookie =
      typeof request.cookies?.csrf_token === 'string'
        ? request.cookies.csrf_token
        : undefined;
    const csrfHeaderRaw = request.headers['x-csrf-token'];
    const csrfHeader = Array.isArray(csrfHeaderRaw)
      ? csrfHeaderRaw[0]
      : csrfHeaderRaw;

    if (!csrfCookie || !csrfHeader) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (csrfCookie !== csrfHeader) {
      throw new ForbiddenException('CSRF token invalid');
    }

    return true;
  }
}
