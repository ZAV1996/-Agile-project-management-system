import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { env } from "process";
import { Injectable } from "@nestjs/common";
import { CreateTokenData } from "../types";


@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.PRIVATE_KEY_REFRESH || "as6c54asc46",
            passReqToCallback: true
        })
    }
    validate(req: Request, payload: CreateTokenData) {
        const refresh_token = req.get('authorization')?.replace('Bearer', '').trim();
        return {
            ...payload,
            refresh_token
        }
    }
}