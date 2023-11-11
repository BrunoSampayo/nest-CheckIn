import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from "express";
import { Injectable } from "@nestjs/common/decorators";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {


    constructor() {
        super({
            secretOrKey: process.env.RT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        })
    }
    validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization').replace("Bearer", '').trim();
        return {
            ...payload,
            refreshToken
        };
    }
}