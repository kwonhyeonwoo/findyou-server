import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Review, dataSource.createEntityManager());
    }

    async createReview(body: CreateReviewDto, userId: string, errandId: string) {
        const review = this.create({
            ...body,
            user: { id: userId },
            errand: { id: errandId },
        });
        return await this.save(review);
    }
}