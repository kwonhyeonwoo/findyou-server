import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CustomCategory } from "src/interfaces/custom-category.enum";
import { HelperMovement } from "../entities/helper-post.entity";

export class CreateHelperPostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    address_dong: string

    @IsString()
    @IsNotEmpty()
    introduction: string

    @IsEnum(CustomCategory)
    @IsNotEmpty()
    category: CustomCategory

    @Type(() => Number)
    @IsNotEmpty()
    lat: number

    @Type(() => Number)
    @IsNotEmpty()
    lng: number

    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    price: number

    @IsString()
    @IsNotEmpty()
    openLink: string

    @IsEnum(HelperMovement)
    @IsNotEmpty()
    movement: HelperMovement
}
