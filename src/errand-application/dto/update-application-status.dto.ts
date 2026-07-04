import { IsEnum } from "class-validator"

export enum ApplicationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export class UpdateApplicationStatusDto {
    @IsEnum(ApplicationStatus, {
        message: '유효하지 않은 상태값입니다.'
    })
    status: ApplicationStatus;
}