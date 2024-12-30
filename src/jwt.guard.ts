import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SKIP_JWT_KEY } from './exclude-jwt.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route has the @SkipJwt decorator
    const skipJwt = this.reflector.get<boolean>(
      SKIP_JWT_KEY,
      context.getHandler(),
    );
    // console.log('JwtGuard - Executing Guard', skipJwt);
    // console.log('JwtGuard - Token', process.env.JWT_SECRET);
    // console.log(
    //   'JwtGuard - Authorization Header:',
    //   context.switchToHttp().getRequest().headers['authorization'],
    // );

    if (skipJwt) {
      return true; // Skip JWT validation for this route
    }

    const isValid = await super.canActivate(context) as boolean;
    console.log('JwtGuard - Token Validation Result:', isValid);
    return isValid; // Call the default AuthGuard if no decorator found
  }
}
