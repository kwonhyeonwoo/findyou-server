import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { ReviewTag } from "./enum/review-tags.enum";
import { ReviewRole } from "./enum/review-role.enum";
import { ICreateReview } from "./interface/create-review.interface";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Review, dataSource.createEntityManager());
    }

    // 심부름 리뷰.
    async existErrandReview(errandId: string, reviewrId: string) {
        const review = await this.findOne({
            where: {
                errandApplication: { id: errandId },
                reviewer: { id: reviewrId }
            }
        })
        return review;
    }

    async existHelperPostReview(helperApplicationId: string, reviewrId: string) {
        const exist = this.findOne({
            where: {
                helperApplication: { id: helperApplicationId },
                reviewer: { id: reviewrId }
            }
        })

        return exist;
    }

    async createErrandReview(data: ICreateReview) {
        const review = this.create({
            rating: data.rating,
            tags: data.tags,
            content: data.content,
            reviewer: { id: data.reviewerId },
            reviewee: { id: data.revieweeId },
            role: data.role,
            errandApplication: { id: data.errandApplicationId },
        });
        return await this.save(review);
    }

    async createHelperReview(data: ICreateReview) {
        const review = this.create({
            rating: data.rating,
            tags: data.tags,
            content: data.content,
            reviewer: { id: data.reviewerId },
            reviewee: { id: data.revieweeId },
            role: data.role,
            helperApplication: { id: data.helperApplicationId },
        });
        return await this.save(review);
    }
}