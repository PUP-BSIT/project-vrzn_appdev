import { IsNumber, IsOptional, IsString } from "class-validator";

export class Reservation {
    @IsOptional()
    @IsNumber()
    id?: number

    @IsNumber()
    property_id: number;

    @IsNumber()
    applicant_id: number;

    @IsString()
    notes: string;

    @IsString()
    status: string;
}