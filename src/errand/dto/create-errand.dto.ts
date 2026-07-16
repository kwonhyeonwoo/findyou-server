import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../../user/entities/user.entity";
import { ErrandCategory } from "../interface/errand.interface";

export class CreateErrandDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(ErrandCategory)
    @IsNotEmpty()
    category: ErrandCategory;

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

    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    openLink: string;
}