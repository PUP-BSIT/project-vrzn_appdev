import { IsNumber, IsString } from "class-validator";

export class Reservation {
    @IsNumber()
    property_id: number;

    @IsNumber()
    user_id: number;

    @IsString()
    notes: string;

    @IsString()
    status: string;
}