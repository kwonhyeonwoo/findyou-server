import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { ReviewTag } from "../enum/review-tags.enum";

export class CreateReviewDto {
    @IsString()
    content: string;

    @IsNumber()
    rating: number;

    @IsArray()
    @IsEnum(ReviewTag)
    tags: ReviewTag[];
}
