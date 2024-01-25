import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Observable } from 'rxjs';

@Injectable()
export class AGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const access_token = req.cookies.access;
        try {
            if (!access_token) {
                throw new UnauthorizedException({ message: "У вас нет прав доступа" })
            }
            const user = this.jwtService.verify(access_token, { secret: env.PRIVATE_KEY_ACCESS })
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: "У вас нет прав доступа" })
        }
    }
}
