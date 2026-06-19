import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateErrandDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    address_dong: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Type(() => Number)
    lat: number;

    @IsNumber()
    @Type(() => Number)
    lng: number;

    @IsString()
    @IsNotEmpty()
    price: string;

    @IsString()
    @IsNotEmpty()
    openLink: string;
}
