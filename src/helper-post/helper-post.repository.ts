import { DataSource, DeepPartial, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { Review } from "src/review/entities/review.entity";
import { Errand } from "src/errand/entities/errand.entity";
import { HelperPost } from "./entities/helper-post.entity";
import { HelperApplication } from "src/helper-application/entities/helper-application.entity";

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
        return {
            ...helper,
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

    // 완료요청 (게시글에서 처리)
    async completeRequest(id: string, userId: string) {
        await this.update(id, {
            status: CustomStatus.COMPLETED_REQUEST,
            completionRequestedBy: userId,
        })
    }

    // 수락된 신청내역과 함께 조회 (완료 확인 권한 체크용)
    async findOneWithAcceptedApplication(id: string) {
        const helperPost = await this.findOne({
            where: {
                id,
                applications: {
                    status: CustomStatus.ACCEPTED
                }
            },
            relations: {
                applications: {
                    client: true,
                }
            },
            select: {
                applications: {
                    id: true,
                    status: true,
                    client: { id: true }
                }
            }
        });
        return helperPost;
    }

    // 완료 (의뢰인이 확인)
    async completed(id: string) {
        await this.dataSource.transaction(async (manager) => {
            await manager.update(HelperPost, id, { status: CustomStatus.COMPLETED });
            await manager.update(HelperApplication, {
                helperPosts: { id },
                status: CustomStatus.ACCEPTED
            }, {
                status: CustomStatus.COMPLETED
            });
        })
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
                    reviews: {
                        reviewer: true,
                        reviewee: true
                    }
                }
            },
            select: {
                applications: {
                    id: true,
                    status: true,
                    client: { id: true ,nickName:true},
                    reviews: {
                        id: true,
                        rating: true,
                        tags: true,
                        content: true,
                        reviewer: { id: true },
                        reviewee: { id: true }
                    }
                }
            }
        });
        const helperPost = helperPosts.map((post) => ({
            ...post,
            applications: post.applications?.map((application) => ({
                ...application,
                hasWrittenReview: application.reviews.some(review => review.reviewer.id === userId),
                review: application.reviews.find(review => review.reviewer.id === application.client.id)
            }))
        }));
        return helperPost;
    }

}
