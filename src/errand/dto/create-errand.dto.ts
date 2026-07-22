import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../../user/entities/user.entity";
import { CustomCategory } from "src/interfaces/custom-category.enum";

export class CreateErrandDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(CustomCategory)
  @IsNotEmpty()
  category: CustomCategory;

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

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  deadlineTime: Date
}