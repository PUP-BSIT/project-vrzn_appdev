import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
          secretOrKey: configService.get<string>('JWT_SECRET'),
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