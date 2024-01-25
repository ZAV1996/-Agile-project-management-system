import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { env } from "process";
import { Observable } from "rxjs";
import { JWTSession } from "src/auth/entities/JWTSession.entity";
import { CreateTokenData } from "src/auth/types";
import { Repository } from "typeorm";


@Injectable()
export class ATGuard extends AuthGuard('jwt') {
    constructor() {
        super()
    }
}