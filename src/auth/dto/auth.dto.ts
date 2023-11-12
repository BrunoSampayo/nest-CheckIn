import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthSignUpDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
export class AuthSignInDto {
   

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}