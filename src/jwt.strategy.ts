import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('JwtStrategy - Validating Strategy:', Strategy);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {

    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token');
    }
    console.log('JwtStrategy - Validating Payload:', payload);
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}

