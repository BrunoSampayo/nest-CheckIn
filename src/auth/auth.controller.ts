import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto, AuthSignUpDto } from './dto';
import { Tokens } from './types';
import { AtGuard, RtGuard } from 'src/commom/guards';
import { GetCurrentUserId, GetCurrentUser, Public } from 'src/commom/decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthSignUpDto): Promise<Tokens> {
        return this.authService.signupLocal(dto)
    }

    @Public()
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthSignInDto): Promise<Tokens> {
        return this.authService.signinLocal(dto)
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: string) {

        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken)
    }
}
