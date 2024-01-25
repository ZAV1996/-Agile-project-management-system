import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { env } from "process";
import { Observable } from "rxjs";
import { JWTSession } from "src/auth/entities/JWTSession.entity";
import { Repository } from "typeorm";

export class RTGuard extends AuthGuard('jwt-refresh') {
    constructor(@InjectRepository(JWTSession) private RTokensRepository: Repository<JWTSession>, private jwtService: JwtService) {
        super()
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const refresh_token = request.cookies.refresh;
        try {
            this.jwtService.verify(refresh_token, { secret: env.PRIVATE_KEY_REFRESH })
            return true
        } catch {
            const data = this.jwtService.decode(refresh_token)
            this.RTokensRepository.manager.delete(JWTSession, { UUID: data.UUID })
            throw new UnauthorizedException({ message: "Токен больше не активен", status: 401 })
        }
    }
}