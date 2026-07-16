import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { ReviewTag } from "./enum/review-tags.enum";
import { ReviewRole } from "./enum/review-role.enum";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Review, dataSource.createEntityManager());
    }

    async existsReview(errandId: string, reviewrId: string) {
        const review = await this.findOne({
            where: {
                errand: { id: errandId },
                reviewer: { id: reviewrId }
            }
        })
        return review;
    }

    async createReview(data: {
        rating: number;
        tags: ReviewTag[];
        content: string;
        reviewerId: string;
        revieweeId: string;
        role: ReviewRole;
        errandId: string;
    }) {
        const review = this.create({
            rating: data.rating,
            tags: data.tags,
            content: data.content,
            reviewer: { id: data.reviewerId },
            reviewee: { id: data.revieweeId },
            role: data.role,
            errand: { id: data.errandId },
        });
        return await this.save(review);
    }
}