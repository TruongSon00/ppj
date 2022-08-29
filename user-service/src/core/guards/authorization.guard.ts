import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_CODE } from '@core/decorator/get-code.decorator';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { IS_PUBLIC_KEY } from '@core/decorator/set-public.decorator';
import { ConfigService } from '@config/config.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
  private readonly configService: ConfigService;

  constructor(
    private reflector: Reflector,
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {
    this.configService = new ConfigService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = await context.switchToHttp().getRequest();

    const token =
      context.getType() === 'rpc'
        ? `Bearer ${this.configService.get('internalToken')}`
        : req.headers['authorization'];

    const permissionCode = this.reflector.getAllAndOverride<string>(
      PERMISSION_CODE,
      [context.getHandler(), context.getClass()],
    );

    const res = await this.authService.validateToken(token, permissionCode);

    if (res) {
      if (res.statusCode !== 200) {
        throw new HttpException(res.message, res.statusCode);
      }
      req.user = res.data;

      if (res.statusCode !== 200) {
        throw new HttpException(res.message, res.statusCode);
      }
      if (req.body) {
        req.body.user = res.data;
        req.body.userId = res.data?.id;
      }
      if (req.params) {
        req.params.user = res.data;
        req.params.userId = res.data?.id;
      }
      if (req.query) {
        req.query.user = res.data;
        req.query.userId = res.data?.id;
      }
      return true;
    }

    return false;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
