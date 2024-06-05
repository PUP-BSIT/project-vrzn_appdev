import { IsString } from 'class-validator';

export class CreatePhoneNumberDto {
  @IsString()
  number: string;
}
