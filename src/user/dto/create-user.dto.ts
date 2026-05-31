import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
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
    verify: string;

    @IsString()
    region: string;

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
