import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from "@nestjs/common/decorators";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {


    constructor() {
        super({
            secretOrKey: process.env.AT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           
        })
    }
    validate (payload: any){
        return payload;
    }
}