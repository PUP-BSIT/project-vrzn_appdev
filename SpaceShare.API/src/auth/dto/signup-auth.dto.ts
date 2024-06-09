import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePhoneNumberDto } from './create-phone-number.dto';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsString()
  surname: string;

  @IsDateString()
  birthdate: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsString()
  city: string;

  @IsString()
  postal_code: string;

  @IsBoolean()
  @IsOptional()
  is_proprietor: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePhoneNumberDto)
  phone_number?: CreatePhoneNumberDto[];
}
