import { IsEnum } from "class-validator"
import { CustomStatus } from "../../interfaces/custom-status.enum";

export class UpdateApplicationStatusDto {
    @IsEnum(CustomStatus, {
        message: '유효하지 않은 상태값입니다.'
    })
    status: CustomStatus;
}