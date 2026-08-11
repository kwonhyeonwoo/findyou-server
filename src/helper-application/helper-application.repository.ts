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

    async findOneApplication(helperId: string) {
        const application = await this.findOne({
            where: {
                helperPosts: { id: helperId },
            },
            relations: { helperPosts: true }
        });
        return application;
    };

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
                helperPosts: true
            }
        })
        return applications;
    }
    // 받은내역
    async findReceivedApplications(helperPostId:string) { 
        const applications = await this.find({
            where:{
                helperPosts:{id:helperPostId}
            },
            relations:{
                client:true
            }
        });
        return applications;
    }

    async accepted(id:string){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try{
            const application = await queryRunner.manager.findOne(HelperApplication,{
                where:{id},
                relations:{helperPosts:true}
            });
            if(!application) throw new NotFoundException('신청 내역이 없습니다.');
            const helperPost = application.helperPosts;
            if(!helperPost) throw new NotFoundException('헬퍼 게시글이 없습니다.');
            if(application.status === CustomStatus.IN_PROGRESS) throw new BadRequestException('이미 진행중인 내역 입니다.')
            
            await queryRunner.manager.update(HelperApplication,{
                id,
                status:CustomStatus.PENDING
            },{
                status:CustomStatus.COMPLETED
            });

            await queryRunner.manager.update(HelperApplication,{
                helperPosts:{id:application.helperPosts.id},
                status:CustomStatus.PENDING
            },{status:CustomStatus.REJECTED})

            await queryRunner.manager.update(HelperPost,{
                id:application.helperPosts.id
            },{
                status:CustomStatus.IN_PROGRESS
            })
            await queryRunner.commitTransaction()
        }catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }finally{
            await queryRunner.release()
        }
    }

    async rejected(id:string,userId:string){
        const application = await this.findOne({
            where:{id},
            relations:{
                helperPosts:{
                    helper:true
                }
            }
        });
        if(application.status === CustomStatus.REJECTED){
            throw new BadRequestException('이미 거절된 내역 입니다.')
        };
        if(application.helperPosts.id !== userId){
            throw new ForbiddenException('본인 게시글의 신청만 거절할 수 있습니다.')
        }
        await this.update(id,{
            status:CustomStatus.REJECTED
        })
    }
}