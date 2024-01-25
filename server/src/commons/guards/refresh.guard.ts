import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';
import { env } from 'process';
import { Observable } from 'rxjs';

@Injectable()
export class RGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const refresh_token = req.cookies.refresh;
        try {
            if (!refresh_token) {
                throw new UnauthorizedException({ message: "У вас нет прав доступа" })
            }
            const user = this.jwtService.verify(refresh_token, { secret: env.PRIVATE_KEY_REFRESH })
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: "У вас нет прав доступа" })
        }
    }
}
