import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateHelperApplicationDto {
    @IsString({ message: "메시지를 입력해주세요." })
    @IsNotEmpty()
    message: string;

    @IsString({ message: "오픈링크를 입력해주세요." })
    @IsNotEmpty()
    openLink: string;

    @IsBoolean()
    saveAsDefault: boolean;

    // @IsString()
    // @IsNotEmpty()
    // helperId: string;
}
