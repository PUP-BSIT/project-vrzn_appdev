import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class SignInDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 20 , { message: 'Password has to be at least 4 characters'})
    public password: string
}