import { IsNotEmpty, IsString } from "class-validator";

export class CreateHelperApplicationDto {
    @IsString()
    @IsNotEmpty()
    message:string;

    @IsString()
    @IsNotEmpty()
    helperId:string;
}
