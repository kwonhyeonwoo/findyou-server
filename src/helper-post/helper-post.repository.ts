import { DataSource, DeepPartial, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { Review } from "src/review/entities/review.entity";
import { Errand } from "src/errand/entities/errand.entity";
import { HelperPost } from "./entities/helper-post.entity";

@Injectable()
export class HelperPostRepository extends Repository<HelperPost> {
    constructor(
        private readonly dataSource: DataSource,
    ) {
        super(HelperPost, dataSource.createEntityManager());
    }

    async createHelper(body: DeepPartial<HelperPost>) {
        const newHelper = this.create(body);
        return await this.save(newHelper);
    }

    async findLists() {
        return await this.find({
            relations: {
                helper: {
                    receivedReviews: true
                }
            },
            select: {
                helper: {
                    id: true,
                    nickName: true,
                    profile: true,
                    receivedReviews: true,
                }
            }
        })
    }

    async findHelperProfile(helperId: string, limit?: string) {
        const take = limit ? +limit : 5;
        const helper = await this.findOne({
            where: {
                id: helperId,
            },
            relations: {
                helper: true,
            },
        });
        if (!helper) throw new NotFoundException('헬퍼를 찾을 수 없습니다.')
        const receivedReviews = await this.dataSource.getRepository(Review).find({
            where: { reviewee: { id: helper.helper.id } },
            order: { createdAt: "DESC" },
            take,
        });
        const errands = await this.dataSource.getRepository(Errand).find({
            where: {
                helper: {
                    id: helper.helper.id
                },
                status: CustomStatus.COMPLETED,
            },
            take,
            order: { createdAt: "DESC" }
        })
        return {
            ...helper,
            errands,
            receivedReviews,
        }

    }

    async findOneHelper(helperId: string) {
        const helper = await this.findOne({
            where: {
                id: helperId,
                helper: true
            },
            relations: { helper: true }
        });
        return helper;
    }

    // 내가 등록한 헬퍼게시글 목록
    async findMyPosts(userId: string) {
        const helperPosts = await this.find({
            where: {
                helper: {
                    id: userId
                }
            },
            relations: {
                applications: {
                    client: true,
                    reviews: true
                }
            }
        });

        const aaaa = helperPosts.map((post) => ({
            ...post,
            applications: post.applications?.map((application) => ({
                ...application,
                hasWrittenReview: application.reviews.length > 0 ? true : false,
            }))
        }));
        console.log('aaaa', aaaa[0].applications)
        return aaaa;
    }

}
