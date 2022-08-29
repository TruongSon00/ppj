import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { IS_PUBLIC_KEY } from '@core/decorator/set-public.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject('AUTH_SERVICE')
    private readonly authService: AuthServiceInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = await context.switchToHttp().getRequest();

    const res = await this.authService.validateToken({
      jwt: req.headers['authorization']?.split(' ')[1],
    });

    if (res) {
      if (res.statusCode !== 200) {
        throw new HttpException(res.message, res.statusCode);
      }
      req.user = res.data;
      return true;
    }

    return false;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
