import { IsNotEmpty, IsString,IsBoolean } from "class-validator";

export class CreateErrandApplicationDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    openLink: string;

    @IsBoolean()
    @IsNotEmpty()
    saveAsDefault: boolean;
}
