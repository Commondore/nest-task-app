import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: (req) => req?.cookies?.[config.get('COOKIE_NAME')],
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: number }) {
    return { userId: payload.sub };
  }
}
