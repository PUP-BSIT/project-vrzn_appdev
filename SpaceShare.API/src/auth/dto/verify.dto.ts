import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class verification {
    @IsNotEmpty()
    @IsNumber()
    public code: number;

    @IsNotEmpty()
    @IsEmail()
    public mailTo: string;
}