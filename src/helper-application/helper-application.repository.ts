import { DataSource, DeepPartial, Repository } from "typeorm";
import { HelperApplication } from "./entities/helper-application.entity";
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { HelperPost } from "src/helper-post/entities/helper-post.entity";

@Injectable()
export class HelperApplicationRepository extends Repository<HelperApplication> {
    constructor(private readonly dataSource: DataSource) {
        super(HelperApplication, dataSource.createEntityManager())
    }

    async createApplication({
        message,
        clientId,
        helperId,
    }: {
        message: string,
        clientId: string,
        helperId: string
    }) {
        const application = this.create({
            message,
            client: { id: clientId },
            helperPosts: { id: helperId },
        });
        return await this.save(application);
    }

    // 의뢰인, 헬퍼게시글,헬퍼
    async findOneWithHelperPost(appliId: string) {
        const application = await this.findOne({
            where: { id: appliId },
            relations: {
                helperPosts: {
                    helper: true,
                },
                client:true
            }
        });
        return application;
    };

    // 헬퍼신청 내역만
    async findOneApplication(id:string){
        const application = await this.findOne({where:{id}});
        return application;
    }

    async checkApplication(clientId: string, helperId: string) {
        const existApplication = await this.findOne({
            where: {
                client: {
                    id: clientId
                },
                helperPosts: { id: helperId }
            }
        })
        return existApplication;
    }

    // 지원내역
    async findApplicationsHistory(userId: string) {
        const applications = await this.find({
            where: {
                client: {
                    id: userId
                }
            },
            relations: {
                helperPosts: {
                    helper: true,
                },
                reviews: {
                    reviewer: true
                },
            }
        })
        return applications.map((app) => ({
            ...app,
            hasWrittenReview: app.reviews.some((review) => review.reviewer.id === userId) ?? false
        }))
    }
    // 받은내역
    async findReceivedApplications(helperPostId: string) {
        console.log('gggg', helperPostId)
        const applications = await this.find({
            where: {
                helperPosts: { id: helperPostId }
            },
            relations: {
                helperPosts: true,
                client: true
            }
        });
        return applications;
    }

    async accepted(id: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const application = await queryRunner.manager.findOne(HelperApplication, {
                where: { id },
                relations: { helperPosts: true }
            });
            if (!application) throw new NotFoundException('신청 내역이 없습니다.');
            const helperPost = application.helperPosts;
            if (!helperPost) throw new NotFoundException('헬퍼 게시글이 없습니다.');
            if (application.status === CustomStatus.IN_PROGRESS) throw new BadRequestException('이미 진행중인 내역 입니다.')

            await queryRunner.manager.update(HelperApplication, {
                id,
                status: CustomStatus.PENDING
            }, {
                status: CustomStatus.COMPLETED
            });

            await queryRunner.manager.update(HelperApplication, {
                helperPosts: { id: application.helperPosts.id },
                status: CustomStatus.PENDING
            }, { status: CustomStatus.REJECTED })

            await queryRunner.manager.update(HelperPost, {
                id: application.helperPosts.id
            }, {
                status: CustomStatus.IN_PROGRESS
            })
            await queryRunner.commitTransaction()
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release()
        }
    }

    async rejected(id: string, userId: string) {
        const application = await this.findOne({
            where: { id },
            relations: {
                helperPosts: {
                    helper: true,
                }
            }
        });
        if (application.status === CustomStatus.REJECTED) {
            throw new BadRequestException('이미 거절된 내역 입니다.')
        };
        if (application.helperPosts.helper.id !== userId) {
            throw new ForbiddenException('본인 게시글의 신청만 거절할 수 있습니다.')
        }
        await this.update(id, {
            status: CustomStatus.REJECTED
        })
    }

    // 지원취소
    async deleteApplication(id: string) {
        const application = await this.delete(id);
        return application;
    }

    // 완료요청 
    async completedRequest(id:string){
        return await this.update(id,{
            status:CustomStatus.COMPLETED_REQUEST
        })
    }

    async completed(id:string){
        await this.dataSource.transaction(async(manager)=>{
            const application = await manager.findOne(HelperApplication,{
                where:{id},
                relations:{helperPosts:true},
            })
            // const application = await manager.update(HelperApplication,id,{
            //     status:CustomStatus.COMPLETED
            // });
            await manager.update(HelperApplication,id,{status:CustomStatus.COMPLETED})
            console.log('여기가?',application)
            await manager.update(HelperPost,application.helperPosts.id,{
                status:CustomStatus.COMPLETED
            });

        })
        // const application = await this.update(id,{status:CustomStatus.COMPLETED});
        // return application;
    }
}