import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateErrandDto {
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    category:string;

    @IsString()
    @IsNotEmpty()
    address:string;

    @IsString()
    @IsNotEmpty()
    description:string;

    @IsString()
    @IsNotEmpty()
    price:string;

    @IsString()
    @IsNotEmpty()
    openLink:string;
}
