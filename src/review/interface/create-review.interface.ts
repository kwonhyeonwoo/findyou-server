import { ReviewRole } from "../enum/review-role.enum";
import { ReviewTag } from "../enum/review-tags.enum";

export interface ICreateReview {
    rating: number;
    tags: ReviewTag[];
    content: string;
    reviewerId: string;
    revieweeId: string;
    role: ReviewRole;
    errandApplicationId?: string;
    helperApplicationId?: string;
}