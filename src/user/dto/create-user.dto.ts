import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { IUserRole } from "../interfaces/user-role";

export class CreateUserDto {
    @IsEnum(IUserRole)
    type: IUserRole;

    @IsString()
    division: 'kakao' | 'naver' | 'email'

    @IsEmail()
    email: string;

    @IsString()
    nickName: string;

    @IsString()
    name: string;

    @IsString()
    phone: string;


    @IsString()
    address: string;

    @IsString()
    address_dong:string;

    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;

    @IsString()
    password: string;

    @IsBoolean()
    agreeUsage: boolean;

    @IsBoolean()
    agreePrivacy: boolean;

    @IsBoolean()
    agreeMarketingMandatory: boolean;

    @IsBoolean()
    agreeMarketingOptional: boolean;
}
