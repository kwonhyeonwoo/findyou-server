import { IsNotEmpty, IsString } from "class-validator";

export class CreateErrandApplicationDto {
    @IsString()
    @IsNotEmpty()
    message: string;
}
