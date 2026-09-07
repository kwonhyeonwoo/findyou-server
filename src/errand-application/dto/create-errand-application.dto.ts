import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CreateErrandApplicationDto {
    @IsString()
    @IsNotEmpty({ message: "메시지를 입력해주세요." })
    message: string;

    @IsString()
    @IsNotEmpty({ message: "오픈링크를 입력해주세요." })
    openLink: string;

    @IsBoolean()
    saveAsDefault: boolean;
}
