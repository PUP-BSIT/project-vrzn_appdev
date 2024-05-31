import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
          secretOrKey: process.env.JWT_SECRET,
        });
    }

    private static extractJWT(req: Request): string {
        if(!(req.cookies && 'token' in req.cookies)) return null;

        return req.cookies.token;
    }

    async validate(payload: {id: string; email: string }){
        return payload;
    }
}