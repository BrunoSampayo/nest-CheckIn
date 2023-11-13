import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignInDto, AuthSignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { networkInterfaces } from 'os';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService) { }





    async signupLocal(dto: AuthSignUpDto): Promise<Tokens> {
        const userCheck = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (userCheck) throw new HttpException("User alredy exist", HttpStatus.CONFLICT)
        const hash = await this.hashData(dto.password)
        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                hashPassword: hash
            }
        })

        const tokens = await this.getTokens(newUser.id, newUser.email, newUser.RoleId)
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }
    async updateRtHash(userId: string, rt: string) {
        const hash = await this.hashData(rt)
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                RThash: hash
            }
        });
    }



    async signinLocal(dto: AuthSignInDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) throw new HttpException("Email or password incorrect", HttpStatus.UNAUTHORIZED)

        const hashCompare = await bcrypt.compare(dto.password, user.hashPassword)
        if (hashCompare === false) throw new HttpException("Email or password incorrect", HttpStatus.UNAUTHORIZED)

        const tokens = await this.getTokens(user.id, user.email, user.RoleId)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }

    async logout(userid:string) {
        const checkRTHash = await this.prisma.user.findUnique({
            where:{
                id:userid
            }
        })
        if(checkRTHash.RThash === null) throw new HttpException ("Something wrong", HttpStatus.FORBIDDEN)
        await this.prisma.user.update({
            where:{
                id: userid,
                RThash:{
                    not:null
                }
            },data:{
                RThash:null
            }
        })
     }
    async refreshTokens() { }








    async hashData(data: string): Promise<string> {
        return await bcrypt.hash(data, 10)
    }

    async getTokens(userId: string, email: string, role?: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
                role
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: 60 * 15, //15 minutes 
            }),

            this.jwtService.signAsync({
                sub: userId,
                email,
                role
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: 60 * 60 * 24 * 7, //one week
            })
        ]);
        return {
            access_token: at,
            refresh_token: rt
        }

    }





}
