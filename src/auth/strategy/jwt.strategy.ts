import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Role } from 'src/generated/prisma/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: (req) =>
        req?.cookies?.[
          config.get<string>('COOKIE_ACCESS_NAME') ??
            config.get<string>('COOKIE_NAME') ??
            'access_token'
        ] as string,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: number; role: Role }) {
    return { userId: payload.sub, role: payload.role };
  }
}
