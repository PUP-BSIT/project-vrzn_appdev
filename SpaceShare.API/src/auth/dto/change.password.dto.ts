import { IsNumber, IsString } from "class-validator";

export class ChangePassword {
  @IsNumber()
  userId: number;

  @IsString()
  newPassword: string;
  
  @IsString()
  currentPassword: string;
}