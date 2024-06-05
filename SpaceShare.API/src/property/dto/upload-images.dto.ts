import { IsNumber, IsString } from "class-validator";

export class UploadImagesDto {
    @IsNumber()
    property_id: number

    @IsString()
    image_url: string
}