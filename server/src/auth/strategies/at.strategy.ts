import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { env } from "process";
import { CreateTokenData } from "../types";
import { Request } from 'express'



@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.PRIVATE_KEY_ACCESS || "as6c54asc46asca",
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
    // success(user: any, info?: any): void {
    //     console.log(user);
    //     return user
    // }
}